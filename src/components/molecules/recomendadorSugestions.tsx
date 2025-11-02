/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { CarouselFields, ErrorData, PlanCardDataFields, RecomendadorSugestionsProps } from "@/types/Recomendador";
import { useRecomendadorContent } from "@/utils/RecomendadorProvider"
import { Entry, EntrySkeletonType } from "contentful";
import { Suspense, useEffect, useMemo, useState } from "react";
import { carouselServerAction } from "../organisms/carouselServerAction";
import { LoaderIcon } from "@/constants/IconsConstants";

export default function RecomendadorSugestions({ newSelectionAction }: RecomendadorSugestionsProps) {

    const context = useRecomendadorContent();

    const [renderedComponent, setRenderedComponent] = useState<React.ReactNode | null>(null)

    const title = context.contentfulEntry?.fields.titlePropuestas as string;
    const subTitle = context.contentfulEntry?.fields.subTitlePropuestas as string;
    const buttonText = context.contentfulEntry?.fields.ctaTextPropuestas as string;
    const error = context.casosError as ErrorData;

    const entryCards = [context.contentfulEntry?.fields.cardPropuestas] as Entry<EntrySkeletonType<CarouselFields>>[] | null;
    const recomendationVel = context.recomendation;

    const filterData = useMemo(() => {
        return filterCards(entryCards, recomendationVel)
    }, [entryCards, recomendationVel])

    useEffect(() => {
        function renderCarousel() {
            if (filterData.length > 0) {
                const rendered = carouselServerAction(filterData as unknown as Entry<EntrySkeletonType, undefined, string>[] | null);
                setRenderedComponent(rendered)
            }
        }
        renderCarousel();
    }, [filterData.length]);

    function filterCards(data: unknown, velRecomendada: string | null): Entry<EntrySkeletonType>[] {

        if (!Array.isArray(data) || !data[0] || !velRecomendada) {
            return [];
        }

        const typedData = data as Entry<
            EntrySkeletonType<{
                cardsCarousel: Entry<
                    EntrySkeletonType<PlanCardDataFields>
                >[];
            }>
        >[]

        const carousel = typedData[0];
        const cards = carousel.fields.cardsCarousel;

        if (!Array.isArray(cards)) {
            return []
        }
        const filteredCards = cards.filter(
            (card) => card.fields.recomendadorId?.toLowerCase() === velRecomendada.toLowerCase()
        );

        if ( filteredCards.length === 0) {
            return [];
        }

        const modifiedEntry = {
            ...carousel,
            fields: {
                ...carousel.fields,
                cardsCarousel: filteredCards,
            },
        };

        return [modifiedEntry];
    }

    return (
        <>
            {filterData.length > 0 && renderedComponent ?

                <div className="flex flex-col items-center">
                    <h1 className="font-bold leading-[48px] text-4xl text-black-0 text-center mb-[40px] md:mx-md 2xl:mx-xl">{title}</h1>
                    <h3 className="font-normal leading-[24px] text-xl text-black-0 text-center md:mx-md 2xl:mx-xl">{subTitle}</h3>
                    <Suspense
                        fallback={
                            <div className="flex justify-center py-[80px] md:mx-md 2xl:mx-xl">
                                <div className="w-[104px] h-[104px]">
                                    <LoaderIcon />
                                </div>
                            </div>
                        }
                    >
                        <div className="w-full h-auto">{renderedComponent}</div>
                    </Suspense>
                    <button
                        className="w-[320px] h-auto rounded-md border-1 border-black-0 py-[14px] px-[16px] font-bold leading-[24px] text-lg text-black-0 text-center md:mx-md 2xl:mx-xl"
                        onClick={() => newSelectionAction()}
                    >
                        {buttonText}
                    </button>
                </div>
                :

                <div className="flex flex-col items-center">
                    <h1 className="font-bold leading-[48px] text-4xl text-black-0 text-center mb-[40px] md:mb-[24px] md:mx-md 2xl:mx-xl">{error.error.title}</h1>
                    <div className="flex flex-col gap-[8px] md:gap-0 font-normal leading-[24px] text-lg text-black-0 text-center md:mx-md 2xl:mx-xl">
                        <p>
                            {`${error.error.subTitle1} ${error.error.subTitle2}`}
                        </p>
                    </div>
                    <button
                        className="w-[320px] h-auto rounded-md border-1 border-black-0 bg-black-0 py-[14px] px-[16px] mt-[40px] font-semibold leading-[24px] text-lg text-white-0 text-center md:mx-md 2xl:mx-xl"
                        onClick={() => newSelectionAction()}
                    >
                        {error.error.button.text}
                    </button>
                </div>

            }
        </>
    )
}