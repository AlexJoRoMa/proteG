import { Entry, EntrySkeletonType } from "contentful";
import { ReactNode } from "react";

// props
export type ConfiguradorProps = {
    id: string;
}

export type StepProps = {
    step: number
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
    discountPrice: string,
    beforePrice: string,
    price: number,
    afterPrice: string,
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

//Provider

export type ProviderProps = {
    children: ReactNode,
    value: DataFields,
}

export type DataFields = {
    pageEntry?: Entry<EntrySkeletonType, undefined> | null,
    dataEntry?: Record<string, EntrySkeletonType<ConfigDataFields>>
    dataResumen?: {},
    userAnswers?: Record<string, ComponentsFields>,
    setUserAnswers?: React.Dispatch<React.SetStateAction<Record<string, ComponentsFields>>>
}

export type UserAnswers = Record<string, ComponentsFields>

// Resumen de Compra

export type ResumenData = {
    titulo: string,
    pagoPosterior: string,
    ahorro: {
        domicilio: string,
        pagoAnticipado: string,
        paquete: string
    },
    boton: {
        comprobarPromociones: string,
        contratar: {
            titulo: string,
            url: string
        }
    },
    total: {
        sinDescuentos: string,
        titulo: string
    }
}