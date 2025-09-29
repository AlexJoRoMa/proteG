import { EntrySkeletonType } from "contentful"
import { Document } from '@contentful/rich-text-types';
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
    subTitle: string;
    ctaText: string,
    type: string,
    cards: CardDataFields[],
    colorBtn?: boolean,
    textUpBtn: string,
}

export type CardDataFields = {
    cards: CardDataFields[],
    ctaText: string,
    ctaLink?: string,
    description: string,
    internalName: string,
    titleRich: Document;
    title: string,
    type: string,
    isModal?: string,
    modal?: {
        sys: {
            id: string;
        };
    },
    colorHr?: string,
    colorBtn?: boolean,
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