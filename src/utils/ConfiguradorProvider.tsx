'use client'

import { ComponentsFields, DataFields, ProviderProps, UserAnswers } from "@/types/ConfiguradorTypes";
import { createContext, useContext, useState } from "react";

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
    resumenIcon,
    ottsImages
}: ProviderProps) => {

    const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
    const [checkedPromotions, setCheckedPromotions] = useState<boolean>(false);
    const [infoDrawerContent, setInfoDrawerContent] = useState<string>("");

    return (
        <configuradorContext.Provider
            value={{
                configuradorEntry,
                copysResumen,
                resumenIcon,
                userAnswers,
                setUserAnswers,
                checkedPromotions,
                setCheckedPromotions,
                ottsImages,
                infoDrawerContent,
                setInfoDrawerContent
            }
            }
        >
            {children}
        </configuradorContext.Provider>
    )
}