import { Entry, EntrySkeletonType } from "contentful";
import { ReactNode } from "react";

// props
export type ConfiguradorProps = {
    id: string;
}

export interface ConfiguradorCopyFields {
    cobertura: string;
    internet: string;
    movil: string;
    title: string;
    tv: {
        title: string;
        description: string;
    }
}

// entryData
export interface ConfigDataFields {
    title: string,
    subTitle: string,
    description: string,
    stepNumber: number,
    internalName: string,
    components: ComponentsFields[] | ConfigTabsFields[],
    type: string
}

export interface ComponentsFields {
    fields: ComponentsFields,
    sys: {
        id: string
    },
    internalName: string,
    maxCapacityInternet: string,
    minCapacityInternet: string,
    price: number,
    subTitle: string,
    title: string,
    ctaText: string
}

//entryTabs

export interface ConfigCardsFields {
    interalName: string,
    entryTitle: string,
    cards: ComponentsFields[]
}

export interface ConfigTabsFields {
    internalName: string,
    type: string,
    tabs: ConfigCardsFields[]
}

//cardPlanes

export type PlansCardProps = {
    data?: CodigoPostalProps
}

//copy CP
export type CodigoPostalProps = {
    codigoPostal: {
        button: string,
        label: string,
        placeHolder: string
    }
}

//Provider Props

export type ProviderProps = {
    children: ReactNode,
    value: DataFields
}

export type DataFields = {
    coberturaCopy: CodigoPostalProps,
    pageEntry: Entry<EntrySkeletonType, undefined> | null
}