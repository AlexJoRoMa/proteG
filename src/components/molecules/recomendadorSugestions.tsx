'use client'

import { CarouselFields, RecomendadorSugestionsProps } from "@/types/Recomendador";
import { useRecomendadorContent } from "@/utils/RecomendadorProvider"
import { Entry, EntrySkeletonType } from "contentful";
import CarouselCardComponent from "../organisms/CarouselCardComponent";

export default function RecomendadorSugestions({ newSelectionAction }: RecomendadorSugestionsProps) {

    const context = useRecomendadorContent();

    const title = context.contentfulEntry?.fields.titlePropuestas as string;
    const subTitle = context.contentfulEntry?.fields.subTitlePropuestas as string;
    const buttonText = context.contentfulEntry?.fields.ctaTextPropuestas as string;

    const entryCards = [context.contentfulEntry?.fields.cardPropuestas] as Entry<EntrySkeletonType<CarouselFields>>[] | null;
    const recomendationVel = context.recomendation;

    const filterData = filterCards(entryCards, recomendationVel);

    const cardsSugestion = filterData as unknown as Entry<EntrySkeletonType, undefined, string>[] | null
    console.log('sugestion', cardsSugestion)

    function filterCards(data: Entry<EntrySkeletonType<CarouselFields>>[] | null, velRecomendada: string | null): Entry<EntrySkeletonType, undefined, string>[] | null {

        if(!data?.[0] || !Array.isArray(data[0]?.fields.cardsCarousel)) {
            console.error("data.fields.cardsCarousel no es un array")
            return [];
        }

        if (!velRecomendada) {
            return [];
        }

        const filteredCards = data[0]?.fields.cardsCarousel.filter((card) =>
            card?.fields.recomendadorId?.toLowerCase() === velRecomendada.toLowerCase()
        );
        console.log('filtered', filteredCards)
        return filteredCards;

    }

    return (
        <>
            <div className="flex flex-col gap-[40px] items-center text-center md:mx-md 2xl:mx-xl">
                <h1 className="font-bold leading-[48px] text-4xl text-black-0">{title}</h1>
                <h3 className="font-normal leading-[24px] text-xl text-black-0">{subTitle}</h3>
                {/* <CarouselCardComponent recomendador={cardsSugestion}/> */}
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