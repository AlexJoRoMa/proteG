'use client'

import AccordionPlanesExtras from "@/components/atoms/accordionPlanesExtras";
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


export default function PlanesTv({ step }: StepProps) {

    const content = useContent();
    const plans = content.dataEntry?.tv && content.dataEntry?.tv;

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
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{step}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{plans?.fields.title}</h3>
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
                                            <h1 className="text-2xl font-extrabold leading-[24px]">{card.fields.title}</h1>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex flex-col gap-[8px]">
                                            <p className="leading-[18px] font-normal text-sm text-gray-300">{card.fields.subTitle}</p>
                                            {isSelected &&
                                                <div>
                                                    <p className="font-normal text-sm mb-[24px]">{plans?.fields.description}</p>
                                                </div>
                                            }
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="flex flex-col gap-[8px] w-full">
                                            <div className="flex flex-row items-baseline text-start gap-[4px]">
                                                {card.fields.discountPrice && <p className="font-normal text-sm text-gray-200 line-through">{`$${card.fields.discountPrice}`}</p>}
                                                {card.fields.beforePrice && <p className="text-sm font-normal">{card.fields.beforePrice}</p>}
                                                <div className="flex flex-row items-baseline">
                                                    <p className="text-lg font-bold">{`$${card.fields.price}`}</p>
                                                    <p className="text-sm font-normal">{card.fields.afterPrice}</p>
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
            <div>
                {selectedIndex === null ?
                    <h5 className="font-normal leading-[24px] text-base">{plans?.fields.subTitle}</h5> :
                    <AccordionPlanesExtras />
                }
            </div>
        </div>

    )
}