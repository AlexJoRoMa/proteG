'use client'

import { DataFields, IzziSelection, ProviderProps, UserAnswers } from "@/types/ConfiguradorTypes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { IzziSelectionGuard } from "./guards/IzziSelectionGuard";
import { useIzziContent } from "../components/providers/IzziProvider";

const configuradorContext = createContext<DataFields | undefined>(undefined);

export const useContent = () => {
    const ctx = useContext(configuradorContext);
    if (!ctx) {
        throw new Error('useContent se debe usar dentro del ConfiguradorProvider')
    }
    return ctx;
}

export const ConfiguradorProvider = ({
    children,
    configuradorEntry,
    copysResumen,
    copysConfigurador,
    resumenIcon,
    ottsImages,
    cobertura,
    initialCoberturaData
}: ProviderProps) => {

    const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
    const [izziSelection, setIzziSelection] = useState<IzziSelection | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [rehydrated, setRehydrated] = useState(false);

    const { setGlobalUserAnswers, setGlobalIzziSelection, globalUserAnswers, setGlobalFlagDomicilio, setCoberturaData, setFormattedAddress } = useIzziContent();

    // Sincronizar datos de cobertura desde las cookies al IzziProvider
    useEffect(() => {
        if (initialCoberturaData && Object.keys(initialCoberturaData).length > 0) {
            setCoberturaData(initialCoberturaData);
            if (initialCoberturaData.address) {
                setFormattedAddress(initialCoberturaData.address);
            }
        }
    }, [initialCoberturaData, setCoberturaData, setFormattedAddress]);

    useEffect(() => {
        IzziSelectionGuard(userAnswers, setIzziSelection)
    }, [userAnswers])

    useEffect(() => {

        setUserAnswers((prev) => {

            const internetTotal = Number(prev.internet?.total) || 0;
            const tvTotal = Number(prev.tv?.total) || 0;
            const ottTotal = Number(prev.tv?.ott?.total) || 0;
            const movilTotal = Number(prev.movil?.total) || 0;

            if (internetTotal || tvTotal || ottTotal || movilTotal) {
                return {
                    ...prev,
                    total: (internetTotal + tvTotal + ottTotal + movilTotal)
                };
            } else {
                return {}
            }
        });
    }, [userAnswers.internet, userAnswers.tv, userAnswers.movil])

    useEffect(() => setGlobalUserAnswers(userAnswers), [userAnswers, setGlobalUserAnswers]);
    useEffect(() => setGlobalIzziSelection(izziSelection), [izziSelection, setGlobalIzziSelection]);
    useEffect(() => {
        if (!!userAnswers.internet) {
            setGlobalFlagDomicilio(false);
        } else {
            setGlobalFlagDomicilio(true);
        }
    }, [setGlobalFlagDomicilio, userAnswers.internet])

    useEffect(() => {
        if (!globalUserAnswers || rehydrated) return;

        const hasLocalAnswers = userAnswers.internet || userAnswers.tv || userAnswers.movil;

        if (!hasLocalAnswers) {
            setUserAnswers(globalUserAnswers);
        }
        setRehydrated(true);
    }, [globalUserAnswers, rehydrated, userAnswers.internet, userAnswers.movil, userAnswers.tv]);

    const value = useMemo(() => ({
        configuradorEntry,
        copysResumen,
        copysConfigurador,
        resumenIcon,
        cobertura,
        userAnswers,
        setUserAnswers,
        izziSelection,
        setIzziSelection,
        ottsImages,
        disabled,
        setDisabled,
        rehydrated,
    }), [
        configuradorEntry, 
        copysResumen, 
        copysConfigurador, 
        resumenIcon, 
        cobertura, 
        userAnswers, 
        izziSelection, 
        ottsImages, 
        disabled, 
        rehydrated
    ]);
    
    return (
        <configuradorContext.Provider
            value={value}
        >
            {children}
        </configuradorContext.Provider>
    )
}