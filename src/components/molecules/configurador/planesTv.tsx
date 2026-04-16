'use client'

import LinkModal from "@/components/atoms/LinkModal";
import ConfiguradorCardsModalComponent from "@/components/layouts/modals/ConfiguradorCardsModalComponent";
import AccordionPlanesExtras from "@/components/molecules/configurador/accordionPlanesExtras";
import { CheckPlanesIcon } from "@/constants/IconsConstants";
import { OfferItem, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS, CURRENCY } from "@/lib/tracking/constants";

export default function PlanesTv({ step, preSeleccion }: StepProps) {
    const { configuradorEntry, setUserAnswers, setDisabled, userAnswers, copysConfigurador } = useContent();

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const tvUserInteracted = useRef(false);
    const viewListTrackedRef = useRef(false);

    const offersCopys = copysConfigurador as unknown as OffersCopys;
    const precioTv = configuradorEntry?.offers.TV.find((offer) => offer.titulo === 'izzi tv')?.precioPaquete;

    const tvPlans = useMemo(() => {
        const internet = userAnswers.internet;

        if (internet?.paquete) {
            const tvLight = configuradorEntry?.offers.TV.filter(item => item.titulo.includes("light")) as OfferItem[] || [];
            const tvPremium = configuradorEntry?.offers.TV.filter(item => item.titulo.includes("premium")) as OfferItem[] || [];
            const triplePlay = (configuradorEntry?.offers.TRIPLE_PLAY || [])
                .filter((item: OfferItem) => item.velocidadMinima === internet.paquete?.velocidadMinima)
                .map((item: OfferItem) => {
                    const totalAhorros = item.izziAhorros?.reduce((acc, ahorro) => acc + Number(ahorro.monto), 0) || 0;
                    const precioTachado = (Number(item.precioPaquete || 0) - totalAhorros - Number(internet?.paquete?.precioTachado)).toString();
                    return {
                        ...item,
                        titulo: offersCopys.tv.cards.titulo,
                        tituloTriplePlay: item.titulo,
                        precioPaquete: precioTachado,
                        precioTachado: precioTv,
                        precioTriplePlay: item.precioPaquete
                    } as OfferItem;
                }) as OfferItem[];
            return [...triplePlay, ...tvPremium, ...tvLight];
        }
        return (configuradorEntry?.offers.TV || []).map((item: OfferItem) => {
            if (!item.titulo.includes("light") && !item.titulo.includes("premium")) {
                return { ...item, titulo: offersCopys.tv.cards.tituloPlus } as OfferItem;
            }
            return item as OfferItem;
        });
    }, [userAnswers.internet, configuradorEntry?.offers.TV, configuradorEntry?.offers.TRIPLE_PLAY, offersCopys.tv.cards.titulo, offersCopys.tv.cards.tituloPlus, precioTv]);

    useEffect(() => {
        if (viewListTrackedRef.current) return;
        if (!tvPlans || tvPlans.length === 0) return;

        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;
        const listId = "tv";
        const listName = offersCopys.tv.titulo;

        const items = tvPlans.map((offer, index) =>
            buildPlanItem(
                {
                    id: String(offer.idPaquete),
                    sku: offer.nombreCode,
                    name: offer.tituloTriplePlay ?? offer.titulo,
                    category: "Bundle",
                    technology: offer.tiempoPlan?.includes("TRIPLE") ? "Triple_Play" : "Doble_Play",
                    price: offer.precioPaquete,
                    speed: offer.velocidadMinima,
                    channels: offer.canales,
                    contractMonths: offer.tiempoPlan,
                },
                index,
                listId,
                listName
            )
        );

        pushEcommerceEvent(
            EVENTS.VIEW_ITEM_LIST,
            {
                currency: CURRENCY,
                value: 0,
                items,
            }
        );

        viewListTrackedRef.current = true;
    }, [tvPlans, offersCopys.tv.titulo]);

    useEffect(() => {
        if (userAnswers.tv?.paquete) {
            updateTvAnswers(tvPlans[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAnswers.internet])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateTvAnswers = (selectedTv: OfferItem) => {
        setUserAnswers(prev => ({
            ...prev,
            tv: {
                ...prev.tv,
                paquete: selectedTv,
                total: Number(selectedTv.precioPaquete) || 0
            }
        }));
    };

    function handleSelect(index: number, card: OfferItem) {
        tvUserInteracted.current = true;

        if (selectedIndex === index) {
            setSelectedIndex(null);
            setUserAnswers(prev => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { tv, ...rest } = prev;
                return rest;
            });
            setDisabled(false);
            return;
        }

        setSelectedIndex(index);

        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;
        const listId = "tv";
        const listName = offersCopys.tv.titulo;

        const item = buildPlanItem(
            {
                id: String(card.idPaquete),
                sku: card.nombreCode,
                name: card.tituloTriplePlay ?? card.titulo,
                category: "Bundle",
                technology: card.tiempoPlan?.includes("TRIPLE") ? "Triple_Play" : "Doble_Play",
                price: card.precioPaquete,
                speed: card.velocidadMinima,
                channels: card.canales,
                contractMonths: card.tiempoPlan,
            },
            0,
            listId,
            listName
        );

        pushEcommerceEvent(
            EVENTS.SELECT_ITEM,
            {
                currency: CURRENCY,
                value: Number(card.precioPaquete) || 0,
                items: [item],
            }
        );

        setUserAnswers(prev => ({
            ...prev,
            tv: {
                ...prev.tv,
                paquete: card,
                total: Number(card.precioPaquete) || 0
            }
        }));

        if (card.titulo.includes('light') || card.titulo.includes('premium')) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    function handleIsPressable(card: OfferItem): boolean {
        if ((card.titulo.includes('light') || card.titulo.includes('premium')) && (userAnswers.internet?.paquete)) {
            return false;
        } else {
            return true;
        }
    }

    function trackPlanDetailView(card: OfferItem, index: number) {
        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;
        const listId = "tv";
        const listName = offersCopys.tv.titulo;

        const item = buildPlanItem(
            {
                id: String(card.idPaquete),
                sku: card.nombreCode,
                name: card.tituloTriplePlay ?? card.titulo,
                category: "Bundle",
                technology: card.tiempoPlan?.includes("TRIPLE") ? "Triple_Play" : "Doble_Play",
                price: card.precioPaquete,
                speed: card.velocidadMinima,
                channels: card.canales,
                contractMonths: card.tiempoPlan,
            },
            index,
            listId,
            listName
        );

        pushEcommerceEvent(
            EVENTS.VIEW_ITEM,
            {
                currency: CURRENCY,
                value: Number(card.precioPaquete) || 0,
                items: [item],
            }
        );
    }

    useEffect(() => {
        if (!preSeleccion.seleccionPaquete) return;
        if (!tvPlans.length) return;
        if (userAnswers.tv?.paquete) return;
        if (tvUserInteracted.current) return;

        const planCode = String(preSeleccion.seleccionPaquete);
        const lower = planCode.toLowerCase();
        const isSoloTv = lower.startsWith("izzitv");
        const isTriplePlay = !isSoloTv && lower.includes("_");

        let matchedOffer: OfferItem | undefined;
        if (isSoloTv) {
            matchedOffer = tvPlans.find(offer => String(offer.nombreCode ?? '').toLowerCase() === lower);
        } else if (isTriplePlay) {
            const tvCodePart = planCode.split("_")[1];
            matchedOffer = tvPlans.find(offer => String(offer.nombreCode ?? '').toLowerCase().includes(tvCodePart.toLowerCase()));
        }

        if (!matchedOffer) return;

        const index = tvPlans.findIndex(o => o.idPaquete === matchedOffer.idPaquete);
        if (index !== -1) setSelectedIndex(index);

        queueMicrotask(() => {
            setUserAnswers(prev => ({
                ...prev,
                tv: {
                    paquete: matchedOffer,
                    total: Number(matchedOffer!.precioPaquete) || 0
                }
            }));
        })
    }, [preSeleccion.seleccionPaquete, setUserAnswers, tvPlans, userAnswers.tv?.paquete]);

    useEffect(() => {
        const tvPaquete = userAnswers.tv?.paquete;
        if (!tvPaquete) {
            setSelectedIndex(null);
            return;
        }
        const index = (tvPlans || []).findIndex(offer => String(offer.idPaquete) === String(tvPaquete.idPaquete));
        if (index !== -1 && selectedIndex !== index) setSelectedIndex(index);
    }, [selectedIndex, tvPlans, userAnswers.tv?.paquete]);

    useEffect(() => {
        if (!tvPlans || tvPlans.length === 0) return;

        const currentTv = userAnswers.tv?.paquete;

        if (currentTv && currentTv.titulo === offersCopys.tv.cards.tituloPlus) {
            const izziTv = tvPlans.find((offer) => offer.titulo === offersCopys.tv.cards.titulo);

            if (izziTv) {
                const idx = tvPlans.indexOf(izziTv);
                setSelectedIndex(idx);
                updateTvAnswers(izziTv);
                return;
            }
        }

        if (currentTv && currentTv.titulo === offersCopys.tv.cards.titulo) {
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

            const sameTitle = currentTv?.titulo === selectedTv.titulo;
            const samePrice = String(currentTv?.precioPaquete) === String(selectedTv.precioPaquete);

            if (!sameTitle || !samePrice) {
                updateTvAnswers(selectedTv);
            }
            return;

        }

    }, [userAnswers.tv?.paquete, tvPlans, selectedIndex, offersCopys.tv.cards.tituloPlus, offersCopys.tv.cards.titulo, updateTvAnswers]);

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{step}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{offersCopys.tv.titulo}</h3>
            </div>

            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[16px] 2xl:gap-[24px] auto-rows-fr">
                {(tvPlans || []).map((card: OfferItem, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                        <div key={card.idPaquete} className={`w-auto h-full rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}>
                            <Card isPressable={handleIsPressable(card)} onPress={() => handleSelect(index, card)} isDisabled={!handleIsPressable(card)} classNames={{
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
                                        {
                                            (isSelected && card.titulo !== offersCopys.tv.cards.titulo) && (
                                                <p className="font-normal text-sm mb-[24px] text-gray-300">{offersCopys.tv.cards.envio}</p>
                                            )
                                        }
                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <div className="flex flex-col gap-[8px] w-full">
                                        <div className="flex flex-row items-baseline text-start gap-[4px]">
                                            {
                                                userAnswers.internet && card.precioTachado ? (
                                                    <>
                                                        <p className="font-normal text-sm line-through text-gray-200">{FormatCurrency(card.precioTachado)}</p>
                                                        <div className="flex flex-row items-baseline">
                                                            <p className="text-lg font-bold">{FormatCurrency(card.precioPaquete as string)}</p>
                                                            <p className="text-sm font-normal">{`/${card.periodicidad}`}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-row items-baseline">
                                                        <p className="text-lg font-bold">{FormatCurrency(card.precioPaquete)}</p>
                                                        <p className="text-sm font-normal">{`/${card.periodicidad}`}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="flex flex-row gap-[16px] items-center justify-between">
                                            <LinkModal
                                                classNames='underline text-black-0 text-[16px] cursor-pointer'
                                                text={offersCopys.internet.cards.info}
                                                closeButtonStroke='black'
                                                modalContentClassName="w-full h-auto sm:w-[80vw] xl:h-auto xl:w-[90vw] 2xl:w-[62vw] 2xl:h-auto"
                                                backdropColor='black-0/80'
                                                idModal={""}
                                                onOpenModal={() => trackPlanDetailView(card, index)}
                                            >
                                                <ConfiguradorCardsModalComponent variables={{ canales: card.canales, precioPaquete: card.precioPaquete, extras: card.extrasIncluidos }} type="tv" />
                                            </LinkModal>
                                            <span className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-white-0 border-gray-150'}`} aria-pressed={isSelected}>
                                                {isSelected && <CheckPlanesIcon className="w-[16px] h-[16px] text-white-0" />}
                                            </span>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    );
                })}
            </div>

            <div>
                {selectedIndex !== null && <AccordionPlanesExtras />}
            </div>
        </div>
    );
}