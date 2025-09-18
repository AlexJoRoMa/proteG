'use client'

import LinkModal from "@/components/atoms/LinkModal";
import ConfiguradorCardsModalComponent from "@/components/layouts/modals/ConfiguradorCardsModalComponent";
import AccordionPlanesExtras from "@/components/molecules/configurador/accordionPlanesExtras";
import { ComponentsFields, OfferItem, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
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


export default function PlanesTv({ step }: StepProps) {

    const { configuradorEntry, setUserAnswers, setDisabled, userAnswers, copysConfigurador } = useContent();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [tvPlans, setTvPlans] = useState<OfferItem[] | undefined>(configuradorEntry?.offers.TV);

    const offersCopys = copysConfigurador as unknown as OffersCopys;

    const plansInfo = tvPlans as unknown as ComponentsFields[];

    useEffect(() => {
        const internet = userAnswers.internet;

        if (internet && internet !== null) {
            clearSelection();

            const tvLight = configuradorEntry?.offers.TV.filter(item => item.titulo.includes("light")) as OfferItem[];
            const triplePlay = configuradorEntry?.offers.TRIPLE_PLAY.filter(item => item.velocidadMinima === internet.paquete?.velocidadMinima)
                .map((item) => ({
                    ...item,
                    titulo: offersCopys.tv.cards.titulo,
                })) as unknown as OfferItem[];

            const tvOffers = [...triplePlay, ...tvLight]

            setTvPlans(tvOffers);

        } else {
            clearSelection();
            const tvOffers = configuradorEntry?.offers.TV.map((item) => {
                if (!item.titulo.includes("light")) {
                    return {
                        ...item,
                        titulo: offersCopys.tv.cards.tituloPlus
                    }
                } else {
                    return item
                }
            }) as unknown as OfferItem[];

            setTvPlans(tvOffers);
        }

    }, [configuradorEntry?.offers.TRIPLE_PLAY, configuradorEntry?.offers.TV, offersCopys.tv.cards.titulo, offersCopys.tv.cards.tituloPlus, userAnswers.internet]);

    function clearSelection() {
        setSelectedIndex(null);
        setUserAnswers(prev => {
            const { tv, ...rest } = prev;
            return rest
        });
        setDisabled(false);
    }


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
            tv: {
                ...prev.tv,
                paquete: card,
                total: card.precioAhorro ? Number(card.precioAhorro) || 0 : Number(card.precioPaquete) || 0
            },
        }));

        if (card.titulo.includes('light')) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    function handleIsPressable(card: ComponentsFields): boolean {

        if (card.titulo.includes('light') && (userAnswers.internet?.paquete || userAnswers.movil?.paquete)) {
            return false
        } else {
            return true
        }
    };

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{step}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{offersCopys.tv.titulo}</h3>
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
                                    isPressable={handleIsPressable(card)}
                                    onPress={() => handleSelect(index, card)}
                                    isDisabled={!handleIsPressable(card)}
                                    classNames={{
                                        base: "flex flex-col rounded-xs shadow-none h-full w-full",
                                        header: "pt-[16px] pb-[8px]",
                                        body: "py-0",
                                        footer: "pb-[16px] mt-[16px] 2xl:mt-[40px] pt-0"
                                    }}>
                                    <CardHeader>
                                        <div className="flex flex-col text-start">
                                            <h1 className="text-2xl font-extrabold leading-[24px]">{card.titulo}</h1>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex flex-col gap-[8px]">
                                            <p className="leading-[18px] font-normal text-sm text-gray-300">{`${card.canales} canales`}</p>
                                            {isSelected &&
                                                <div>
                                                    <p className="font-normal text-sm mb-[24px]">Envío a domicilio</p>
                                                </div>
                                            }
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="flex flex-col gap-[8px] w-full">
                                            <div className="flex flex-row items-baseline text-start gap-[4px]">
                                                {card.precioAhorro ?
                                                    <>
                                                        <p className="font-normal text-sm line-through text-gray-200">{FormatCurrency(card.precioPaquete)}</p>
                                                        <div className="flex flex-row items-baseline">
                                                            <p className="text-lg font-bold">{FormatCurrency(card.precioAhorro)}</p>
                                                            <p className="text-sm font-normal">{offersCopys.tv.cards.periodo}</p>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        {/* {card.fields.beforePrice && <p className="text-sm font-normal">{card.fields.beforePrice}</p>} */}
                                                        <div className="flex flex-row items-baseline">
                                                            <p className="text-lg font-bold">{FormatCurrency(card.precioPaquete)}</p>
                                                            <p className="text-sm font-normal">{offersCopys.tv.cards.periodo}</p>
                                                        </div>
                                                    </>}

                                            </div>
                                            <div className="flex flex-row gap-[16px] items-center justify-between">
                                                <LinkModal
                                                    classNames='underline text-black-0 text-[16px] cursor-pointer'
                                                    text={offersCopys.internet.cards.info}
                                                    closeButtonStroke='black'
                                                    modalContentClassName="w-full h-auto sm:w-[80vw] xl:h-auto xl:w-[90vw] 2xl:w-[62vw] 2xl:h-auto"
                                                    backdropColor='black-0/80'
                                                    idModal={""}>
                                                    <ConfiguradorCardsModalComponent
                                                        variables={{
                                                            canales: card.canales,
                                                            precioPaquete: card.precioPaquete,
                                                            precioAhorro: card.precioAhorro
                                                        }}
                                                        type="tv"
                                                    />
                                                </LinkModal>
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
                {selectedIndex !== null &&
                    <AccordionPlanesExtras />
                }
            </div>
        </div >

    )
}