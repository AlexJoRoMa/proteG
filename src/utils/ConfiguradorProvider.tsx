'use client'

import { ComponentsFields, DataFields, ProviderProps, UserAnswers } from "@/types/ConfiguradorTypes";
import { createContext, useContext, useState } from "react";

const initialCtx = {
    pageEntry: null,
    userAnswers: {},
    setUserAnswers: () => {}

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

    const serviceKeys = Object.keys(value.dataEntry ?? {});

    const initialUserAnswers: UserAnswers = serviceKeys.reduce((acc, key) => {
        acc[key] = {} as ComponentsFields;
        return acc;
    }, {} as UserAnswers);

    const [userAnswers, setUserAnswers] = useState<UserAnswers>(initialUserAnswers)
    return (
        <configuradorContext.Provider value={{...value, userAnswers, setUserAnswers}}>
            {children}
        </configuradorContext.Provider>
    )
}