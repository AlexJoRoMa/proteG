/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import { ResumenIcon } from '@/types/ConfiguradorTypes'
import { EntrySkeletonType } from 'contentful'
import React, { createContext, useContext } from 'react'

interface ThankYouContextType {
    icon: EntrySkeletonType<ResumenIcon>
    copys: {},
    copyResumen: {},

}
const ThankYouContext = createContext<ThankYouContextType | undefined>(undefined)

interface ThankYouProviderProps {
    children: React.ReactNode
    icon: EntrySkeletonType<ResumenIcon>
    copys: {},
    copyResumen: {}
}

export const ThankYouProvider = ({
    children,
    icon,
    copys,
    copyResumen,
}: ThankYouProviderProps) => {


    const value: ThankYouContextType = {
        icon,
        copys,
        copyResumen,
    }

    return (
        <ThankYouContext.Provider value={value}>
            {children}
        </ThankYouContext.Provider>
    )
}

export const useThankYou = () => {
    const context = useContext(ThankYouContext)
    if (context === undefined) {
        throw new Error('useThankYou must be used within a ThankYouProvider')
    }
    return context
}

export default ThankYouProvider