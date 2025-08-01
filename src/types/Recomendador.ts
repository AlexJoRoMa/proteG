// Props

import { Entry, EntrySkeletonType } from "contentful"
import { ReactNode } from "react"

export type RecomendadorProps = {
    id: string,
}

export type RecomendadorContentProps = {
    data: EntrySkeletonType<StepsDataFields> | null
}

// EntryData

export type EntryDataFields = {
    steps: EntrySkeletonType<StepsDataFields>[],
    titlePropuestas: string,
    subTitlePropuestas: string,
    ctaTextPropuestas?: string,
    ctaUrlPropuestas?: string,
}

// StepsDataFields

export type StepsDataFields = {
    title: string,
    ctaText: string,
    components: EntrySkeletonType<CardDataFields>[]
}

// CardDataFields

export type CardDataFields = {
    title: string,
    type: 'radio' | 'checkbox',
    icon: {
        fields: {
            image: {
                fields: {
                    file: {
                        url: string;
                    };
                };
            };
            altText: string;
        };
    };
}

// Provider Props

export type ProviderProps = {
    children: ReactNode,
    value: DataFields
}

export type DataFields = {
    recomendadorEntry: Entry<EntrySkeletonType, undefined> | null
}