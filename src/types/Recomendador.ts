// Props

import { EntrySkeletonType } from "contentful"

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