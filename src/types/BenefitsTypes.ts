import { EntrySkeletonType } from "contentful"

// props container
export type BenefitsContainerProps = {
    id: string,
}

export type BenefitsContentProps = {
    cards: EntrySkeletonType<CardDataFields> | null
}


//cards

export type BenefitsDataFields = {
    internalName: string,
    title: string,
    ctaText: string,
    type: string,
    cards: CardDataFields[],
}

export type CardDataFields = {
    cards: CardDataFields[],
    ctaText: string,
    ctaLink?: string,
    description: string,
    internalName: string,
    title: string,
    type: string,
    isModal?: string,
    modal?: {
        sys: {
            id: string;
        };
    },
    colorHr?: string,
    image: {
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