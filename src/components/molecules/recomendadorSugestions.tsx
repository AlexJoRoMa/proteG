'use client'

import { RecomendadorSugestionsProps, RecomendationCaseFields, UserAnswers } from "@/types/Recomendador";
import { useRecomendadorContent } from "@/utils/RecomendadorProvider"
import { Entry, EntrySkeletonType } from "contentful";

export default function RecomendadorSugestions({ newSelectionAction }: RecomendadorSugestionsProps) {

    const context = useRecomendadorContent();

    const title = context.contentfulEntry?.fields.titlePropuestas as string;
    const subTitle = context.contentfulEntry?.fields.subTitlePropuestas as string;
    const buttonText = context.contentfulEntry?.fields.ctaTextPropuestas as string;

    const entryCards = context.contentfulEntry?.fields.cardPropuestas;
    const recomendationVel = context.recomendation;

    const cardsSugestion = filterCards(entryCards, recomendationVel);

    console.log('res', entryCards)

    function filterCards(data: any, velRecomendada: string | null) {

        if(!Array.isArray(data.fields.cardsCarousel)) {
            console.error("data.fields.cardsCarousel no es un array")
            return [];
        }

        if (!velRecomendada) {
            return 'no hay data';
        }

        const filteredCards = data.fields.cardsCarousel.filter((card: any) =>
            card.fields.velocityMin?.toLowerCase() === velRecomendada.toLowerCase()
        );
        console.log('filtered', filteredCards)
        return filteredCards;

    }

    return (
        <>
            <div className="flex flex-col gap-[40px] items-center text-center md:mx-md 2xl:mx-xl">
                <h1 className="font-bold leading-[48px] text-4xl text-black-0">{title}</h1>
                <h3 className="font-normal leading-[24px] text-xl text-black-0">{subTitle}</h3>
                <p>carrusel de cards</p>
                <button
                    className="w-[320px] h-auto rounded-md border-1 border-black-0 py-[14px] px-[16px] font-bold leading-[24px] text-lg text-black-0"
                    onClick={() => newSelectionAction()}
                >
                    {buttonText}
                </button>
            </div>
        </>
    )
}