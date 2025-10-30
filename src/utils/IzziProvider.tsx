'use client'

import { DataFields, ProviderProps } from "@/types/IzziTypes";
import { createContext, useContext, useState } from "react";
import { CoberturaType, IzziSelection, Promotion, UserAnswers } from "@/types/ConfiguradorTypes";

const izziContext = createContext<DataFields | undefined>(undefined);

export const useIzziContent = () => {
    const ctx = useContext(izziContext);

    if (!ctx) {
        throw new Error('useRecomendadorContent se debe usar dentro del RecomendadorProvider')
    }

    return ctx;
}

export const IzziProvider = ({ 
    children,
}: ProviderProps) => { 
    const [globalFlag, setGlobalFlag] = useState<boolean>(false);
    const [globalUserAnswers, setGlobalUserAnswers] = useState<UserAnswers>({});
    const [globalIzziSelection, setGlobalIzziSelection] = useState<IzziSelection | null>(null);
    const [formattedAddress, setFormattedAddress] = useState<string>('');
    const [coberturaData, setCoberturaData] = useState<CoberturaType>({});
    const [promoData, setPromoData] = useState<Promotion>({});

    return (
        <izziContext.Provider value={{globalFlag, setGlobalFlag,
                globalUserAnswers,
                setGlobalUserAnswers,
                globalIzziSelection,
                setGlobalIzziSelection,
                formattedAddress,
                setFormattedAddress,
                coberturaData, 
                setCoberturaData,
                promoData,
                setPromoData
        }}>
            {children}
        </izziContext.Provider>
    )
}