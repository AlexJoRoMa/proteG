'use client'

import LinkModal from "@/components/atoms/LinkModal";
import { ComponentsFields, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useEffect, useState } from "react";

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

    const { configuradorEntry, setUserAnswers, disabled, userAnswers, copysConfigurador } = useContent();
    const plans = configuradorEntry?.offers?.DOBLE_PLAY;
    const offersCopys = copysConfigurador as unknown as OffersCopys;

    const plansInfo = plans as unknown as ComponentsFields[];

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    function handleSelect(index: number, card: ComponentsFields) {

        if (selectedIndex !== null) {
            if (selectedIndex === index) {
                clearSelection();
                return;
            }
        }

        setSelectedIndex(index);
        setUserAnswers(prev => ({
            ...prev,
            internet: {
                paquete: card,
                total: Number(card.precioAhorro) || 0
            }

        }))
    }

    function clearSelection() {
        setSelectedIndex(null);
        setUserAnswers(prev => {
            const { internet, ...rest } = prev;
            return rest
        });
    }

    useEffect(() => {
        if (disabled && (userAnswers.internet?.paquete !== null)) {
            setSelectedIndex(null);
            setUserAnswers(prev => {
                const { internet, ...rest } = prev;
                return rest
            });
        }
    }, [disabled])

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className={`w-[40px] h-[40px] ${!disabled ? 'text-white-0 bg-black-0' : 'text-gray-200 bg-gray-50'} rounded-full font-semibold text-base leading-[24px] flex justify-center items-center`}>
                    {step}
                </p>
                <h3 className={`font-semibold text-xl leading-[24px] ${!disabled ? 'text-black-0' : 'text-gray-200'}`}>
                    {offersCopys.internet.titulo}
                </h3>
            </div>

            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[16px] 2xl:gap-[24px] auto-rows-fr">
                {
                    plansInfo.map((card: ComponentsFields, index) => {
                        const isSelected = selectedIndex === index;

                        return (
                            <div
                                key={index}
                                className={`w-auto h-full rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                            >
                                <Card
                                    isPressable={!disabled}
                                    onPress={() => handleSelect(index, card)}
                                    isDisabled={disabled}
                                    classNames={{
                                        base: "flex flex-col rounded-xs shadow-none h-full w-full",
                                        header: "pt-[16px] pb-[8px]",
                                        body: "py-0",
                                        footer: "pb-[16px] mt-[16px] 2xl:mt-[40px] pt-0"
                                    }}>
                                    <CardHeader>
                                        <div className="flex flex-col text-start">
                                            <p className="text-base font-normal leading-[27px]">{`${offersCopys.internet.cards.preVelocidad} ${card.velocidadMinima} ${offersCopys.internet.cards.posVelocidad}`}</p>
                                            <p className="leading-[27px] font-extrabold text-2xl">{`${card.velocidadMaxima} ${offersCopys.internet.cards.unidadVelocidad}`}</p>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex items-stretch">
                                            <p className="leading-[18px] font-normal text-sm text-gray-300">{card.extrasIncluidos[0]}</p>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="flex flex-col w-full gap-[8px]">
                                            <div className="flex flex-row items-baseline gap-[4px]">
                                                <span className="text-sm font-normal text-gray-200 line-through">{FormatCurrency(card.precioPaquete)}</span>
                                                <div className="flex flex-row items-baseline">
                                                    <span className="text-lg font-bold">{FormatCurrency(card.precioAhorro)}</span>
                                                    <span className="text-sm font-normal">{offersCopys.internet.cards.periodo}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-[16px] items-center justify-between">
                                                {/* <p
                                                    className="underline pointer-events-auto"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        console.log('click!!!')
                                                    }}
                                                >{offersCopys.internet.cards.info}</p> */}
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