'use client'

import { useEffect, useRef, useState } from "react";

interface UseStepModalSequenceProps {
    modals: string[];
    durationPerModal?: number;
    isProcessFinished: boolean;
    stepKey: number;
}

export function useStepModalSequence({
    modals,
    durationPerModal = 60000,
    isProcessFinished,
    stepKey
}: UseStepModalSequenceProps) {

    const [currentModal, setCurrentModal] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const indexRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isActiveRef = useRef(false);

    const clear = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const stop = () => {
        clear();
        setIsOpen(false);
        setCurrentModal(null);
        isActiveRef.current = false;
        indexRef.current = 0;
    };

    const runSequence = () => {
        if (!isActiveRef.current) return;

        const modalId = modals[indexRef.current];

        if (!modalId) return;

        setCurrentModal(modalId);
        setIsOpen(true);

        const isLast = indexRef.current === modals.length - 1;

        if (isLast) return;

        timeoutRef.current = setTimeout(() => {
            indexRef.current += 1;
            runSequence();
        }, durationPerModal);
    };

    const start = () => {
        if (!modals.length) return;

        clear();
        isActiveRef.current = true;
        indexRef.current = 0;

        runSequence();
    };

    // Cerrar TODO cuando termina el proceso
    useEffect(() => {
        if (isProcessFinished && isActiveRef.current) {
            stop();
        }
    }, [isProcessFinished]);

    // Cada vez que cambia el step -> reset completo
    useEffect(() => {
        stop();
    }, [stepKey]);

    // Cleanup
    useEffect(() => {
        return () => clear();
    }, []);

    return {
        currentModal,
        isOpen,
        start,
        stop,
    };

}