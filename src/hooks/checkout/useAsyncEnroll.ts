import { useState, useCallback } from 'react';

type JobStatus = "queued" | "running" | "done" | "failed" | "idle";

interface UseAsyncEnrollResult {
    startEnroll: (body: unknown, cookie: string) => Promise<void>;
    status: JobStatus;
    result: unknown;
    error: string | null;
    isLoading: boolean;
    reset: () => void;
}

const POLLING_INTERVAL = 2000; // 2 segundos entre cada check
const MAX_POLLING_TIME = 5 * 60 * 1000; // Máximo 5 minutos de polling

export function useAsyncEnroll(): UseAsyncEnrollResult {
    const [status, setStatus] = useState<JobStatus>("idle");
    const [result, setResult] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    const reset = useCallback(() => {
        setStatus("idle");
        setResult(null);
        setError(null);
    }, []);

    const pollForResult = useCallback(async (jobId: string, startTime: number): Promise<void> => {
        // Verificar si excedimos el tiempo máximo de polling
        if (Date.now() - startTime > MAX_POLLING_TIME) {
            setStatus("failed");
            setError("Timeout: el proceso tardó demasiado");
            return;
        }

        try {
            // Primero verificar el status
            const statusResponse = await fetch(`/api/contratacion/izziEnroll/status?jobId=${jobId}`);
            const statusData = await statusResponse.json();

            if (statusData.status === "failed") {
                setStatus("failed");
                setError(statusData.error || "Error en el proceso");
                return;
            }

            if (statusData.status === "done") {
                // Obtener el resultado
                const resultResponse = await fetch(`/api/contratacion/izziEnroll/result?jobId=${jobId}`);
                const resultData = await resultResponse.json();

                if (resultResponse.ok) {
                    setStatus("done");
                    setResult(resultData.result);
                } else {
                    setStatus("failed");
                    setError(resultData.error || "Error al obtener resultado");
                }
                return;
            }

            // Si todavía está queued o running, actualizar status y seguir polling
            setStatus(statusData.status);
            
            // Esperar y volver a intentar
            await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
            return pollForResult(jobId, startTime);

        } catch (err) {
            setStatus("failed");
            setError(err instanceof Error ? err.message : "Error de conexión");
        }
    }, []);

    const startEnroll = useCallback(async (body: unknown, cookie: string) => {
        try {
            reset();
            setStatus("queued");

            // Iniciar el job
            const startResponse = await fetch('/api/contratacion/izziEnroll/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-Cookie': cookie,
                },
                body: JSON.stringify(body),
            });

            if (!startResponse.ok) {
                throw new Error('Error al iniciar el proceso');
            }

            const { jobId } = await startResponse.json();

            // Iniciar polling
            await pollForResult(jobId, Date.now());

        } catch (err) {
            setStatus("failed");
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    }, [reset, pollForResult]);

    return {
        startEnroll,
        status,
        result,
        error,
        isLoading: status === "queued" || status === "running",
        reset,
    };
}
