'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider";
import { GetProcessStatus } from "@/utils/GetProcessStatus";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr"
import {apiErrorTrack} from '@/utils/errorTrack';

type ProcessStatusResponse = {
    status: 'error' | 'finalizada' | string;
    waitingForAction: boolean;
}

export function useGlobalProcessStatus(onFinalizado?: (data: ProcessStatusResponse) => void) {

    const router = useRouter();
    const { setProcessStatus, izziEnroll } = useCheckout();
    const [pollingActivo, setPollingActivo] = useState(false);
    const [puedeEjecutar, setPuedeEjecutar] = useState(false);

    const detenerPolling = useCallback(() => {
        setPollingActivo(false);
        setPuedeEjecutar(false);
    }, []);

    useEffect(() => {
        if (pollingActivo && izziEnroll) {
            setPuedeEjecutar(true);
        }
    }, [pollingActivo, izziEnroll]);

    const fetchProcessStatus = useCallback(async () => {
        const response = await GetProcessStatus(izziEnroll);
        setProcessStatus(response);
        if (!response) throw new Error('Error al obtener processStatus');

        return response;
    }, [izziEnroll, setProcessStatus]);

    const { data, mutate } = useSWR<ProcessStatusResponse>(
        puedeEjecutar ? ['processStatus', izziEnroll] : null,
        fetchProcessStatus,
        {
            refreshInterval: (data) =>
                data?.waitingForAction || data?.status.includes('Finalizada') || data?.status.includes('error') || data?.status.includes('Error') ? 0 : 10000,
            revalidateOnFocus: false,
            keepPreviousData: false,
            revalidateIfStale: false,
        }
    );

    useEffect(() => {
        if (!data) return;

        if (data.waitingForAction) {
            detenerPolling();
            mutate(data, { revalidate: false });
            return;
        }

        if (data?.status.includes('Finalizada')) {
            detenerPolling();
            onFinalizado?.(data);
            mutate(data, { revalidate: false });
        }
        if (data?.status.includes('error') || data?.status.includes('Error')) {
            detenerPolling();
            console.error('ProcessStatus encontro un error');
            mutate(data, { revalidate: false });
            apiErrorTrack.code = 409;
        }
    }, [data, detenerPolling, mutate, onFinalizado, router]);

    const iniciarPolling = () => {
        if (!pollingActivo) {
            setPollingActivo(true);
        }
    };

    return { iniciarPolling, data };
}
