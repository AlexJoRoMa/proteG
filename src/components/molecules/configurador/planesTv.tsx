'use client'

import LinkModal from "@/components/atoms/LinkModal";
import ConfiguradorCardsModalComponent from "@/components/layouts/modals/ConfiguradorCardsModalComponent";
import AccordionPlanesExtras from "@/components/molecules/configurador/accordionPlanesExtras";
import { CheckPlanesIcon } from "@/constants/IconsConstants";
import { OfferItem, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader, tv } from "@heroui/react";
import { useEffect, useState } from "react";

export default function PlanesTv({ step }: StepProps) {

    const { configuradorEntry, setUserAnswers, setDisabled, userAnswers, copysConfigurador } = useContent();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [tvPlans, setTvPlans] = useState<OfferItem[] | undefined>(configuradorEntry?.offers.TV);

    const offersCopys = copysConfigurador as unknown as OffersCopys;

    const plansInfo = tvPlans as unknown as OfferItem[];

    function updateTvAnswers(selectedTv: OfferItem) {
        setUserAnswers(prev => (
            {
                ...prev,
                tv: {
                    ...prev.tv,
                    paquete: selectedTv,
                    total: Number(selectedTv.precioPaquete) || 0
                },
            }));
    }

    useEffect(() => {
        const internet = userAnswers.internet;

        if (internet) {

            const tvLight = configuradorEntry?.offers.TV.filter(item => item.titulo.includes("light")) as OfferItem[];
            const triplePlay = configuradorEntry?.offers.TRIPLE_PLAY.filter(item => item.velocidadMinima === internet.paquete?.velocidadMinima)
                .map((item) => ({
                    ...item,
                    titulo: offersCopys.tv.cards.titulo,
                })) as unknown as OfferItem[];

            const tvOffers = [...triplePlay, ...tvLight]
            setTvPlans(tvOffers);

        } else {
            const tvOffers = configuradorEntry?.offers.TV.map((item) => {
                if (!item.titulo.includes("light")) {
                    return {
                        ...item,
                        titulo: offersCopys.tv.cards.tituloPlus
                    }
                }
                return item;
            }) as unknown as OfferItem[];
            setTvPlans(tvOffers);
        }
    }, [
        configuradorEntry?.offers.TRIPLE_PLAY,
        configuradorEntry?.offers.TV,
        offersCopys.tv.cards.titulo,
        offersCopys.tv.cards.tituloPlus,
        userAnswers.internet?.paquete
    ]);

    useEffect(() => {

        if (!tvPlans || tvPlans.length === 0) return;

        const prevTv = userAnswers.tv?.paquete;

        if (prevTv && prevTv.titulo === offersCopys.tv.cards.tituloPlus) {
            const izziTv = tvPlans.find((offer) => offer.titulo === offersCopys.tv.cards.titulo);

            if (izziTv) {
                const idx = tvPlans.indexOf(izziTv);
                setSelectedIndex(idx);
                updateTvAnswers(izziTv);
                return;
            }
        }

        if (prevTv && prevTv.titulo === offersCopys.tv.cards.titulo) {
            const izziTvPlus = tvPlans.find((offer) => offer.titulo === offersCopys.tv.cards.tituloPlus);

            if (izziTvPlus) {
                const idx = tvPlans.indexOf(izziTvPlus);
                setSelectedIndex(idx);
                updateTvAnswers(izziTvPlus);
                return;
            }
        }

        if (selectedIndex !== null && tvPlans[selectedIndex]) {
            const selectedTv = tvPlans[selectedIndex];

            const sameTitle = prevTv?.titulo === selectedTv.titulo;
            const samePrice = String(prevTv?.precioPaquete) === String(selectedTv.precioPaquete);

            if (!sameTitle || !samePrice) {
                updateTvAnswers(selectedTv);
            }
            return;

        }
    }, [tvPlans, selectedIndex, offersCopys.tv.cards.titulo, offersCopys.tv.cards.tituloPlus]);

    function clearSelection() {
        setSelectedIndex(null);
        setUserAnswers(prev => {
            const { tv, ...rest } = prev;
            return rest
        });
        setDisabled(false);
    }


    function handleSelect(index: number, card: OfferItem) {

        if (selectedIndex !== null) {
            if (selectedIndex === index) {
                clearSelection();
                return;
            }
        }

        setSelectedIndex(index);
        setUserAnswers(prev => (
            {
                ...prev,
                tv: {
                    ...prev.tv,
                    paquete: card,
                    total: Number(card.precioPaquete) || 0
                },
            }));

        if (card.titulo.includes('light')) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    function handleIsPressable(card: OfferItem): boolean {

        if (card.titulo.includes('light') && (userAnswers.internet?.paquete)) {
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
                    plansInfo.map((card: OfferItem, index) => {
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
                                                {
                                                    // card.precioAhorro ?
                                                    //     <>
                                                    //         <p className="font-normal text-sm line-through text-gray-200">{FormatCurrency(card.precioPaquete)}</p>
                                                    //         <div className="flex flex-row items-baseline">
                                                    //             <p className="text-lg font-bold">{FormatCurrency(card.precioAhorro)}</p>
                                                    //             <p className="text-sm font-normal">{offersCopys.tv.cards.periodo}</p>
                                                    //         </div>
                                                    //     </>
                                                    //     :
                                                        <>
                                                            {/* {card.fields.beforePrice && <p className="text-sm font-normal">{card.fields.beforePrice}</p>} */}
                                                            <div className="flex flex-row items-baseline">
                                                                <p className="text-lg font-bold">{FormatCurrency(card.precioPaquete)}</p>
                                                                <p className="text-sm font-normal">{`/${card.periodicidad}`}</p>
                                                            </div>
                                                        </>
                                                }

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
                                                        }}
                                                        type="tv"
                                                    />
                                                </LinkModal>
                                                <span
                                                    className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-white-0 border-gray-150'}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <CheckPlanesIcon className="w-[16px] h-[16px] text-white-0" />}
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