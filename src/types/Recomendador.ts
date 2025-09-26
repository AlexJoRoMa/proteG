// Props

import { Entry, EntrySkeletonType } from "contentful"
import { ReactNode } from "react"

export type RecomendadorProps = {
    id: string,
}

export type RecomendadorQuestionaryProps = {
    data: EntrySkeletonType<StepsDataFields> | null
}

export type RecomendadorSugestionsProps = {
    newSelectionAction: () => void
}

// EntryData

export type EntryDataFields = {
    steps: EntrySkeletonType<StepsDataFields>[],
    titlePropuestas: string,
    ctaTextPropuestas?: string,
}

export type AnswersGroup = {
    [stepId: string]: string | string[];
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

// Sugestions

export type ConditionQuestionFields = {
    pregunta: string,
    respuestasEsperadas: string[]
}

export type RecomendationCaseFields = {
    condiciones: EntrySkeletonType<ConditionQuestionFields>[],
    resultado: string
}

export type CardSkeleton = EntrySkeletonType<PlanCardDataFields>

export type CardEntry = Entry<CardSkeleton>

export interface CarouselFields {
    cardsCarousel: CardEntry[];
}
export type CarouselSkeleton = EntrySkeletonType<CarouselFields>

export type CarouselEntry = Entry<CarouselSkeleton>


export type PlanCardDataFields = {
    description: string,
    esModal: boolean,
    internalName: string,
    price: string,
    priceBefore: string,
    recomendadorId: string,
    textAfterPrice: string,
    textBeforePrice: string,
    textBtn1: string,
    textBtn2: string,
    title: string,
    type: string,
    urlBtn1: string,
    urlBtn2: string
}

export type ErrorData = {
    error: {
        button: {
            text: string
        },
        subTitle1: string,
        subTitle2: string,
        title: string
    }
}

// Provider

export type DataFields = {
    contentfulEntry: Entry<EntrySkeletonType, undefined> | null,
    casosRecomendador: Entry<EntrySkeletonType, undefined>[] | null,
    casosError: {}
    userAnswers: UserAnswers,
    setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>,
    recomendation: string | null,
    setRecomendation: React.Dispatch<React.SetStateAction<string | null>>
}

export type UserAnswers = {
    [questionTitle: string] : string[];
};