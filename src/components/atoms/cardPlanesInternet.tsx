'use client'

import { Card, CardBody, CardHeader } from "@heroui/react";
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

export default function CardPlanesInternet({ plans }: any) {

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    function handleSelect(index: number) {
        setSelectedIndex(index);
    }

    // const data = contenfulData || integracionData || seleccion del usuario ;  <- data base, de integracion o del usuario
    // const cardData = [];  <- variable a donde se llenan los datos

    return (
        <div className="grid grid-cols-2 gap-[16px]">
            {
                plans.map((card: any) => {
                    const isSelected = selectedIndex === card.index;

                    return (
                        <div
                            key={card.index}
                            className={`w-auto h-auto rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                            onClick={() => handleSelect(card.index)}
                        >
                            <Card
                                classNames={{
                                    base: "flex flex-col gap-[40px] rounded-xs shadow-none h-auto",
                                    header: "px-[16px] pt-[16px] pb-0",
                                    body: "px-[16px] pb-[16px] pt-0"
                                }}>
                                <CardHeader>
                                    <div className="flex flex-col">
                                        <span className="text-base font-normal leading-[27px]">{`de ${card.minInternet} a`}</span>
                                        <span className="leading-[27px] font-extrabold text-2xl">{`${card.maxInternet} MB`}</span>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex flex-col">
                                        <div>
                                            <span className="text-sm font-normal">{"Desde "}</span>
                                            <span className="text-lg font-bold">{`$${card.price}`}</span>
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
    )
}