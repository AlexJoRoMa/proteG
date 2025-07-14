'use client'

import { ComponentsFields, PlansCardProps } from "@/types/ConfiguradorTypes";
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


export default function PlanesTv({ plans }: PlansCardProps) {
    console.log(plans)

    const plansStep = plans?.fields.stepNumber;
    const plansTitle = plans?.fields.title;
    const plansSubTitle = plans?.fields.subTitle;
    const plansDescription = plans?.fields.description;
    const plansInfo = plans?.fields.components as unknown as EntrySkeletonType<ComponentsFields>[];

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedCard, setSelectedCard] = useState<EntrySkeletonType<ComponentsFields>>();

    function handleSelect(index: number, card: EntrySkeletonType<ComponentsFields>) {
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

            <div className="grid grid-cols-1">
                {
                    plansInfo.map((card: EntrySkeletonType<ComponentsFields>, index) => {
                        const isSelected = selectedIndex === index;

                        return (
                            <div
                                key={index}
                                className={`w-auto h-fit rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                                onClick={() => handleSelect(index, card)}
                            >
                                <Card
                                    classNames={{
                                        base: "flex flex-col gap-[40px] rounded-xs shadow-none h-auto",
                                        header: "px-[16px] pt-[16px] pb-0",
                                        body: "px-[16px] pb-[16px] pt-0"
                                    }}>
                                    <CardHeader>
                                        <div className="flex flex-col">
                                            <div className="flex flex-col gap-[8px]">
                                                <h1 className="text-2xl font-extrabold leading-[24px]">{card.fields.title}</h1>
                                                <p className="leading-[27px] font-normal text-base">{card.fields.subTitle}</p>
                                            </div>
                                            {isSelected &&
                                                <div>
                                                    <p className="leading-[27px] font-normal text-base mt-[16px]">{plansDescription}</p>
                                                </div>
                                            }

                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex flex-col gap-[4px]">
                                            <div>
                                                <span className="text-lg font-bold">{`$${card.fields.price}`}</span>
                                                <span className="text-sm font-normal">{" /mes"}</span>
                                            </div>
                                            <div className="flex flex-row gap-[16px] items-center justify-between">
                                                <p className="underline">Más info</p>
                                                <button
                                                    type="button"
                                                    className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-white-0 border-gray-150'}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <CheckIcon className="w-[16px] h-[16px] text-white-0" />}
                                                </button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <h5 className="font-normal leading-[24px] text-base">{plansSubTitle}</h5>
            </div>
        </div>

    )
}