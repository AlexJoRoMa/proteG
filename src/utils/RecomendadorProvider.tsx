'use client'

import { DataFields, ProviderProps } from "@/types/Recomendador";
import { createContext, useContext } from "react"

const initialCtx = {
    recomendadorEntry: null
}

const recomendadorContext = createContext<DataFields>(initialCtx);

export const useRecomendadorContent = () => {
    const ctx = useContext(recomendadorContext);

    if (!ctx) {
        throw new Error('useRecomendadorContent se debe usar dentro del ConfiguradorProvider')
    }

    return ctx;
}

export const RecomendadorProvider = ({ children, value }: ProviderProps) => {
    return (
        <recomendadorContext.Provider value={value}>
            {children}
        </recomendadorContext.Provider>
    )
}