'use client'

import { DataFields, UserAnswers } from "@/types/Recomendador";
import { Entry, EntrySkeletonType } from "contentful";
import { createContext, ReactNode, useContext, useState } from "react"

const recomendadorContext = createContext<DataFields | undefined>(undefined);

export const useRecomendadorContent = () => {
    const ctx = useContext(recomendadorContext);

    if (!ctx) {
        throw new Error('useRecomendadorContent se debe usar dentro del RecomendadorProvider')
    }

    return ctx;
}

export const RecomendadorProvider = ({ 
    children, 
    contentfulEntry, 
    casosRecomendador,
    casosError
}: { 
    children: ReactNode, 
    contentfulEntry: Entry<EntrySkeletonType, undefined> | null, 
    casosRecomendador: Entry<EntrySkeletonType, undefined>[] | null,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    casosError: {}
}) => {

    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [recomendation, setRecomendation] = useState<string | null>(null)

    return (
        <recomendadorContext.Provider value={{contentfulEntry, casosRecomendador, casosError, userAnswers, setUserAnswers, recomendation, setRecomendation}}>
            {children}
        </recomendadorContext.Provider>
    )
}