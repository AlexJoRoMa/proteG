import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useRouter} from "next/navigation";
import { useEffect, useRef } from "react";

interface ProcessStatusLoopOptions {
    fetchFn: () => Promise<any>;
    interval?: number;
    onError?: (error: unknown) => void;
    autoStart?: boolean;
}

export function useProcessStatusLoop({
    fetchFn,
    interval = 10000,
    onError,
    autoStart = false,
}: ProcessStatusLoopOptions) {

    const { setProcessStatus } = useCheckout();
    const controllerRef = useRef<AbortController | null>(null);
    const startedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (!autoStart || startedRef.current) return;
        startedRef.current = true;

        const controller = new AbortController();
        controllerRef.current = controller;

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const loop = async () => {
            try {
                while (!controller.signal.aborted) {
                    const result = await fetchFn();

                    if (!result || result.status === "Error" || result.error) {
                        stop();
                        router.push('/error')
                    }

                    //guardar datos en el provider
                    setProcessStatus({
                        status: result.status,
                        waitingForAction: !!result.waitingForAction,
                    });

                    console.log("processStatus - PING!!", result);

                    if (result.status === "Finalizada") {
                        stop();
                        break;
                    }

                    await sleep(interval);
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    onError?.(err);
                    stop();
                    router.push("/error");
                }
            }
        };

        loop();

        return () => {
            controller.abort();
            startedRef.current = false;
        };
    }, [autoStart]);

    const stop = () => {
        controllerRef.current?.abort();
        startedRef.current = false;
    };

    return { stop };

}