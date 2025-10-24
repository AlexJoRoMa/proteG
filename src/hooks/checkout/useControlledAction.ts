'use client';

import { useCheckout } from '@/components/providers/CheckoutProvider';
import { useEffect, useRef, useState, useCallback } from 'react';
import useSWR from 'swr';

type ProcessStatusResponse = {
    status: string;
    waitingForAction: boolean;
};

type UseControlledActionOptions<T> = {
    /** Acción a ejecutar cuando waitingForAction sea true */
    action: () => Promise<T>;
    /** Callback en éxito */
    onSuccess?: (data: T) => void;
    /** Callback en error */
    onError?: (error: unknown) => void;
    /** Notifica cambios de carga */
    onLoadingChange?: (isLoading: boolean) => void;
    /** Clave opcional para reiniciar el estado interno */
    resetKey?: string | number;
    /**Ejecutar automaticamente cuando waitingForAction=true */
    autoExecute?: boolean;
};

/**
* Ejecuta `action()` automáticamente una sola vez
* cuando `processStatus.waitingForAction === true`.
*/
export function useControlledAction<T>({
    action,
    onSuccess,
    onError,
    onLoadingChange,
    resetKey,
    autoExecute = false,
}: UseControlledActionOptions<T>) {

    type CheckoutContext = {
        processStatus?: Partial<ProcessStatusResponse> | null
    }
    const { processStatus } = useCheckout() as CheckoutContext;

    const waitingPromiseRef = useRef<Promise<void> | null>(null);
    const resolveWaitingRef = useRef<(() => void) | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<T | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    /**  Fuente de verdad: processStatus del provider */
    const { data } = useSWR<ProcessStatusResponse | null>(
        processStatus ? ['processStatus', processStatus.status] : null,
        async () => {
            if (!processStatus || Object.keys(processStatus).length === 0) return null;
            return {
                status: processStatus.status ?? 'unknown',
                waitingForAction: !!processStatus.waitingForAction,
            };
        },
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    );

    /** Reset del estado cuando cambia la key externa */
    useEffect(() => {
        setResult(null);
        setError(null);
        waitingPromiseRef.current = null;
        resolveWaitingRef.current = null;
    }, [resetKey]);

    /** Resolver promesa pendiente si waitingForAction pasa a true */
    useEffect(() => {
        if (data?.waitingForAction && resolveWaitingRef.current) {
            resolveWaitingRef.current();
            resolveWaitingRef.current = null;
            waitingPromiseRef.current = null;
        }
    }, [data?.waitingForAction]);

    /**  Ejecuta acción una sola vez al detectar waitingForAction = true */
    useEffect(() => {
        if (!autoExecute) return;
        if (!data?.waitingForAction) return;

        (async () => {
            try {
                setIsLoading(true);
                onLoadingChange?.(true);
                const res = await action();
                setResult(res);
                onSuccess?.(res);
            } catch (err) {
                setError(err);
                onError?.(err);
            } finally {
                setIsLoading(false);
                onLoadingChange?.(false);
            }
        })();
    }, [autoExecute, data?.waitingForAction, action, onSuccess, onError, onLoadingChange]);

    /** trigger manual opcional */
    const trigger = useCallback(async () => {

        if (!data?.waitingForAction) {
            if (!waitingPromiseRef.current) {
                waitingPromiseRef.current = new Promise<void>((resolve) => {
                    resolveWaitingRef.current = resolve;
                });
            }
            await waitingPromiseRef.current;
        }

        setIsLoading(true);
        onLoadingChange?.(true);
        try {
            const res = await action();
            setResult(res);
            onSuccess?.(res);
            return res;
        } catch (err) {
            setError(err);
            onError?.(err);
            throw err;
        } finally {
            setIsLoading(false);
            onLoadingChange?.(false);
        }
    }, [data?.waitingForAction, action, onSuccess, onError, onLoadingChange]);

    return {
        waitingForAction: data?.waitingForAction ?? false,
        isLoading,
        result,
        error,
        trigger,
    };
}