'use client'

import { DataFields, IzziSelection, ProviderProps, UserAnswers } from "@/types/ConfiguradorTypes";
import { createContext, useContext, useEffect, useState } from "react";
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
    cobertura
}: ProviderProps) => {

    const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
    const [izziSelection, setIzziSelection] = useState<IzziSelection | null>(null);
    const [checkedPromotions, setCheckedPromotions] = useState<boolean>(false);
    const [infoDrawerContent, setInfoDrawerContent] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(false);

    const { setGlobalUserAnswers, setGlobalIzziSelection, globalUserAnswers } = useIzziContent();

    useEffect(() => IzziSelectionGuard(userAnswers, setIzziSelection), [userAnswers])

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
        if (!globalUserAnswers) return;

        const hasLocalAnswers = userAnswers.internet || userAnswers.tv || userAnswers.movil;

        if (!hasLocalAnswers) {
            setUserAnswers(globalUserAnswers);
        }
    }, []);

    return (
        <configuradorContext.Provider
            value={{
                configuradorEntry,
                copysResumen,
                copysConfigurador,
                resumenIcon,
                cobertura,
                userAnswers,
                setUserAnswers,
                izziSelection,
                setIzziSelection,
                checkedPromotions,
                setCheckedPromotions,
                ottsImages,
                infoDrawerContent,
                setInfoDrawerContent,
                disabled,
                setDisabled,
            }
            }
        >
            {children}
        </configuradorContext.Provider>
    )
}