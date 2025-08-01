'use client'

import { CardDataFields, RecomendadorContentProps, StepsDataFields } from "@/types/Recomendador";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { EntrySkeletonType } from "contentful";
import { useCallback, useState } from "react";

export default function RecomendadorContent({ data }: RecomendadorContentProps) {

    const stepsInfo = data as unknown as EntrySkeletonType<StepsDataFields>[];

    const [actualStep, setActualStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    function handleNextStep(step: number) {
        let stepsMax = stepsInfo.length - 1 as number;
        if (step === 0 || step < stepsMax) {
            setActualStep(step + 1);
            setIsComplete(false);
        } else if (step === stepsMax) {
            setIsComplete(true);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-[40px] md:mx-md 2xl:mx-xl">
                <h1 className="font-normal leading-[24px] text-xl self-center">{stepsInfo[actualStep].fields.title}</h1>
                <div className="grid grid-cols-3 gap-[24px]">
                    {stepsInfo[actualStep].fields.components.map((card: EntrySkeletonType<CardDataFields>) => (
                        <Card
                            isPressable
                            classNames={{
                                base: "w-full h-auto bg-transparent rounded-md border-1 border-gray-150 p-[6px] shadow-none",
                                header: "pb-[16px]",
                                footer: "justify-end"
                            }}
                        >
                            <CardBody>
                                <h1 className="font-normal leading-[24px] text-base">{card.fields.title}</h1>
                            </CardBody>
                            <CardFooter>
                                <span
                                    className='w-[24px] h-[24px] rounded-full border flex items-center justify-end transition-colors bg-transparent border-gray-150'
                                >
                                </span>
                            </CardFooter>
                        </Card>
                    ))}
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