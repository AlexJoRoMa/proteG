'use client'

import { ComponentsFields, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
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
            strokeWidth={2}
            viewBox="0 0 24 24"
            width="4px"
            {...props}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
};

export default function PlanesInternet({ step }: StepProps) {

    const content = useContent();
    const entryData = content.configuradorEntry?.internet && content.configuradorEntry?.internet;
    const plans = entryData?.fields;

    const plansInfo = plans?.components as unknown as ComponentsFields[];

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedCard, setSelectedCard] = useState<ComponentsFields>();

    function handleSelect(index: number, card: ComponentsFields) {
        setSelectedIndex(index);
        setSelectedCard(card);
        content.setUserAnswers(prev => ({
            ...prev,
            internet: {
                paquete: card,
                total: Number(card.fields.price) || 0
            }
            
        }))
    }

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{step}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{plans?.title}</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] md:gap-[24px] auto-rows-fr">
                {
                    plansInfo.map((card: ComponentsFields, index) => {
                        const isSelected = selectedIndex === index;

                        return (
                            <div
                                key={index}
                                className={`w-auto h-full rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                            >
                                <Card
                                    isPressable
                                    onPress={() => handleSelect(index, card)}
                                    classNames={{
                                        base: "flex flex-col rounded-xs shadow-none h-full w-full",
                                        header: "pt-[16px] pb-[8px]",
                                        body: "py-0",
                                        footer: "pb-[16px] mt-[16px] md:mt-[40px] pt-0"
                                    }}>
                                    <CardHeader>
                                        <div className="flex flex-col text-start">
                                            <p className="text-base font-normal leading-[27px]">{`de ${card.fields.minCapacityInternet} a`}</p>
                                            <p className="leading-[27px] font-extrabold text-2xl">{card.fields.maxCapacityInternet}</p>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex items-stretch">
                                            <p className="leading-[18px] font-normal text-sm text-gray-300">{card.fields.subTitle}</p>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="flex flex-col w-full gap-[8px]">
                                            <div className="flex flex-row items-baseline gap-[4px]">
                                                <span className="text-sm font-normal">{card.fields.beforePrice}</span>
                                                <div className="flex flex-row items-baseline">
                                                    <span className="text-lg font-bold">{`$${card.fields.price}`}</span>
                                                    <span className="text-sm font-normal">{card.fields.afterPrice}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-[16px] items-center justify-between">
                                                <p
                                                    className="underline pointer-events-auto"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        console.log('click!!!')
                                                    }}
                                                >{card.fields.ctaText}</p>
                                                <span
                                                    className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-white-0 border-gray-150'}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <CheckIcon className="w-[16px] h-[16px] text-white-0" />}
                                                </span>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}