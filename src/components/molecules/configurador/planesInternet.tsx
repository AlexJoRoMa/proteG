'use client'

import { ComponentsFields, ConfigDataFields, PlansCardProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { EntrySkeletonType } from "contentful";
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

export default function PlanesInternet() {

    const content = useContent();
    const entryContent = content.pageEntry?.fields.steps as unknown as EntrySkeletonType<ConfigDataFields>[];
    const plans = entryContent[1];


    const plansStep = plans?.fields.stepNumber;
    const plansTitle = plans?.fields.title;
    const plansInfo = plans?.fields.components as unknown as ComponentsFields[];

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedCard, setSelectedCard] = useState<ComponentsFields>();

    function handleSelect(index: number, card: ComponentsFields) {
        setSelectedIndex(index);
        setSelectedCard(card);
    }

    //TODO: const data = contenfulData || integracionData || seleccion del usuario ;  <- data base, de integracion o del usuario

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{plansStep}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{plansTitle}</h3>
            </div>

            <div className="grid grid-cols-2 gap-[16px]">
                {
                    plansInfo.map((card: ComponentsFields, index) => {
                        const isSelected = selectedIndex === index;

                        return (
                            <div
                                key={index}
                                className={`w-auto h-fit rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                            >
                                <Card
                                    isPressable
                                    onPress={() => handleSelect(index, card)}
                                    classNames={{
                                        base: "flex flex-col gap-[40px] rounded-xs shadow-none h-auto w-full",
                                        header: "px-[16px] pt-[16px] pb-0",
                                        body: "px-[16px] pb-[16px] pt-0"
                                    }}>
                                    <CardHeader>
                                        <div className="flex flex-col">
                                            <span className="text-base font-normal leading-[27px]">{`de ${card.fields.minCapacityInternet} a`}</span>
                                            <span className="leading-[27px] font-extrabold text-2xl">{card.fields.maxCapacityInternet}</span>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex flex-col">
                                            <div>
                                                <span className="text-sm font-normal">{"Desde "}</span>
                                                <span className="text-lg font-bold">{`$${card.fields.price}`}</span>
                                                <span className="text-sm font-normal">{" /mes"}</span>
                                            </div>
                                            <div className="flex flex-row gap-[16px] items-center justify-between">
                                                <p className="underline pointer-events-auto" onClick={() => console.log('click!!!')}>{card.fields.ctaText}</p>
                                                <span
                                                    className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-white-0 border-gray-150'}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <CheckIcon className="w-[16px] h-[16px] text-white-0" />}
                                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}