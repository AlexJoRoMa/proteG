'use client'

import { DataFields, UserAnswers } from "@/types/Recomendador";
import { Entry, EntrySkeletonType } from "contentful";
import { createContext, ReactNode, useContext, useState } from "react"

const recomendadorContext = createContext<DataFields | undefined>(undefined);

export const useRecomendadorContent = () => {
    const ctx = useContext(recomendadorContext);

    if (!ctx) {
        throw new Error('useRecomendadorContent se debe usar dentro del ConfiguradorProvider')
    }

    return ctx;
}

export const RecomendadorProvider = ({ 
    children, 
    contentfulEntry, 
    casosRecomendador 
}: { 
    children: ReactNode, 
    contentfulEntry: Entry<EntrySkeletonType, undefined> | null, 
    casosRecomendador: Entry<EntrySkeletonType, undefined>[] | null
}) => {

    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

    return (
        <recomendadorContext.Provider value={{contentfulEntry, casosRecomendador, userAnswers, setUserAnswers}}>
            {children}
        </recomendadorContext.Provider>
    )
}