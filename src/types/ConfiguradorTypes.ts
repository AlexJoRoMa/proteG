import { Entry, EntrySkeletonType } from "contentful";

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
    stepNumber: number,
    internalName: string,
    components: ComponentsFields[]
}

export interface ComponentsFields {
    internalName: string,
    maxCapacityInternet: string,
    minCapacityInternet: string,
    price: number,
    subTitle: string,
    title: string
}

//entryTabs

export interface ConfigTabFields {
    interalName: string,
    entryTitle: string,
    cards: ComponentsFields[]
}

//cardPlanes

export type PlansCardProps = {
    plans: EntrySkeletonType<ConfigDataFields> | null
}