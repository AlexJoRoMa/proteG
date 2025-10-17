import { useEffect, useRef } from "react";

interface UseExecuteOnWaitingForActions {
    getStatus: () => { waitingForAction?: boolean };
    action: () => void | Promise<void>;
    interval?: number;
}

export function useExecuteOnWaitingForAction({
    getStatus,
    action,
    interval = 1000,
}: UseExecuteOnWaitingForActions) {
    const executedRef = useRef(false);

    useEffect(() => {
        const timer = setInterval(async () => {
            const status = getStatus();

            if (!executedRef.current && status?.waitingForAction) {
                executedRef.current = true;
                await action();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [getStatus, action, interval]);
}