'use client'

import { CardDataFields, RecomendadorContentProps, StepsDataFields } from "@/types/Recomendador";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";
import { useState } from "react";

export const CheckIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="4px"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            viewBox="0 0 24 24"
            width="4px"
            {...props}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
};

export default function RecomendadorContent({ data }: RecomendadorContentProps) {

    const stepsInfo = data as unknown as EntrySkeletonType<StepsDataFields>[];

    const userAnswers = {

    }

    const [actualStep, setActualStep] = useState<number>(0);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [selectCard, setSelectCard] = useState({ index: '', card: '' });

    function handleNextStep(step: number) {
        let stepsMax = stepsInfo.length - 1 as number;
        if (step === 0 || step < stepsMax) {
            setActualStep(step + 1);
            setIsComplete(false);
        } else if (step === stepsMax) {
            setIsComplete(true);
        }
    }

    function handleSelect(index: string, card: EntrySkeletonType<CardDataFields>) {
        setSelectCard({
            index,
            card: card.fields.title
        })
    }

    return (
        <>
            <div className="flex flex-col gap-[40px] md:mx-md 2xl:mx-xl">
                <h1 className="font-normal leading-[24px] text-xl self-center">{stepsInfo[actualStep].fields.title}</h1>
                <div className="grid grid-cols-3 gap-[24px]">
                    {stepsInfo[actualStep].fields.components.map((card: EntrySkeletonType<CardDataFields>) => {

                        const cardId = card as unknown as Entry<EntrySkeletonType<CardDataFields>>;
                        const isSelected = selectCard.index === cardId.sys.id;

                        return (
                            <div 
                                key={cardId.sys.id}
                                className={`w-auto h-fit rounded-md p-[2px] ${isSelected ? 'bg-[image:var(--gradient-card-border)]' : 'border border-gray-150'}`}
                            >
                                <Card
                                    isPressable
                                    onPress={() => handleSelect(cardId.sys.id, card)}
                                    classNames={{
                                        base: "w-full h-auto bg-gray-50 rounded-sm shadow-none",
                                        header: "pb-[16px]",
                                        footer: "justify-end"
                                    }}
                                >
                                    <CardBody>
                                        <div className="flex flex-row gap-[8px]">
                                            <Image
                                                className="w-[24px] h-[24px]"
                                                src={`https:${card.fields.icon.fields.image.fields.file.url}`}
                                                alt={card.fields.icon.fields.altText}
                                                loading="eager"
                                                width={24}
                                                height={24}
                                            />
                                            <h1 className="font-normal leading-[24px] text-base">{card.fields.title}</h1>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <span
                                            className={`w-[24px] h-[24px] ${card.fields.type === 'radio' ? 'rounded-full' : 'rounded-sm'} border flex items-center justify-center self-end transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-transparent border-gray-150'}`}
                                            aria-pressed={isSelected}
                                        >
                                            {isSelected && <CheckIcon className="w-[16px] h-[16px] text-white-0" />}
                                        </span>
                                    </CardFooter>
                                </Card>
                            </div>
                        )
                    })
                    }
                </div>
                <button
                    className="py-[14px] px-[16px] border-1 border-black-0 rounded-md w-[320px] h-auto font-bold leading-[24px] text-lg self-center"
                    onClick={() => handleNextStep(actualStep)}
                >
                    {stepsInfo[actualStep].fields.ctaText}
                </button>
            </div>
        </>
    )

}