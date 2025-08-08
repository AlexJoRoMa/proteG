'use client'

import { DataFields, ProviderProps } from "@/types/ConfiguradorTypes";
import { createContext, useContext } from "react";

const initialCtx = {
    pageEntry: null
}
const configuradorContext = createContext<DataFields>(initialCtx);

export const useContent = () => {
    const ctx = useContext(configuradorContext);
    if (!ctx) {
        throw new Error('useContent se debe usar dentro del ConfiguradorProvider')
    }
    return ctx;
}

export const ConfiguradorProvider = ({ children, value }: ProviderProps) => {
    return (
        <configuradorContext.Provider value={value}>
            {children}
        </configuradorContext.Provider>
    )
}