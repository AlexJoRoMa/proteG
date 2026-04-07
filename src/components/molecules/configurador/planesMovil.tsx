/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import LinkModal from "@/components/atoms/LinkModal";
import ConfiguradorCardsModalComponent from "@/components/layouts/modals/ConfiguradorCardsModalComponent";
import { CheckPlanesIcon } from "@/constants/IconsConstants";
import { MovilPlansInfo, OfferItem, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader, Tab, Tabs } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS, CURRENCY } from "@/lib/tracking/constants";

export default function PlanesMovil({ step, preSeleccion }: StepProps) {
    const { configuradorEntry, setUserAnswers, userAnswers, copysConfigurador } = useContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const plans = configuradorEntry?.offers.MOVIL as unknown as OfferItem[] || [];
    const offersCopys = copysConfigurador as unknown as OffersCopys;

    function formatData(data: OfferItem[], copys: OffersCopys) {
        const contrato12 = data.filter(item => item.titulo.includes("12 meses"));
        const sinPlazo = data.filter(item => !item.titulo.includes("12 meses"));
        return [
            { tituloTab: copys.movil.tabs.contrato, cards: contrato12 },
            { tituloTab: copys.movil.tabs.sinPlazo, cards: sinPlazo }
        ] as MovilPlansInfo[];
    }

    // Memoizar plansInfo para mantener data estable entre renders
    const plansInfo = useMemo(() => {
        const raw = formatData(plans, offersCopys);
        return raw.map(offer => {
            const cardsActualizadas = offer.cards?.map(card => {
                const precioTachado = Number(card.precioPaquete) * 0.5;
                return {
                    ...card,
                    precioPaquete: card.precioPaquete,
                };
            }) ?? [];
            return { ...offer, cards: cardsActualizadas };
        });
    }, [plans, offersCopys]);

    const defaultKey = plansInfo[0]?.tituloTab ?? '';

    const [selectedTabKey, setSelectedTabKey] = useState<string>(defaultKey);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const trackedTabsRef = useRef<Set<string>>(new Set());

    const allCards = useMemo(() => plansInfo.flatMap(t => t.cards ?? []), [plansInfo]);

    // Helper: setear datos de movil en userAnswers
    const applyUserAnswersMovil = (card: OfferItem, contrato?: string) => {
        setUserAnswers(prev => ({
            ...prev,
            movil: {
                paquete: card,
                contrato: contrato ?? (prev.movil?.contrato ?? selectedTabKey),
                total: Number(card.precioPaquete) || 0,
            }
        }));
    };

    function handleSelect(cardId: number, card: OfferItem) {

        if (selectedCardId !== null && selectedCardId === cardId) {
            setSelectedCardId(null);
            setUserAnswers(prev => {
                const { movil, ...rest } = prev;
                return rest;
            });
            return;
        }

        setSelectedCardId(cardId);

        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;
        const listId = `movil_${selectedTabKey}`;
        const listName = selectedTabKey;

        const item = buildPlanItem(
            {
                id: String(card.idPaquete),
                sku: card.nombreCode,
                name: card.tituloTriplePlay ?? card.titulo,
                category: "Bundle",
                technology: card.tiempoPlan?.includes("12 meses") ? "Contrato" : "Sin_Plazo",
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

        applyUserAnswersMovil(card, selectedTabKey);
    }

    function trackPlanDetailView(card: OfferItem, index: number) {
        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;
        const listId = `movil_${selectedTabKey}`;
        const listName = selectedTabKey;

        const item = buildPlanItem(
            {
                id: String(card.idPaquete),
                sku: card.nombreCode,
                name: card.tituloTriplePlay ?? card.titulo,
                category: "Bundle",
                technology: card.tiempoPlan?.includes("12 meses") ? "Contrato" : "Sin_Plazo",
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
        if (!preSeleccion.seleccionMovil) return;
        if (!plansInfo.length) return;
        // no sobreescribir una seleccion
        if (userAnswers.movil?.paquete) return;

        const mobileCode = String(preSeleccion.seleccionMovil);
        const matched = allCards.find(card => String(card.nombreCode) === mobileCode);
        if (!matched) return;

        const parentTab = plansInfo.find(tab => tab.cards?.some(c => String(c.idPaquete) === String(matched.idPaquete)));
        if (parentTab) setSelectedTabKey(parentTab.tituloTab);

        queueMicrotask(() => {
            setSelectedCardId(prev => {
                if (prev === matched.idPaquete) return prev;
                return matched.idPaquete;
            });

            setUserAnswers(prev => {
                if (prev.movil?.paquete?.idPaquete === matched.idPaquete) {
                    return prev;
                }

                return {
                    ...prev,
                    movil: {
                        paquete: matched,
                        contrato: parentTab?.tituloTab ?? selectedTabKey,
                        total: Number(matched.precioPaquete) || 0,
                    }
                };
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preSeleccion.seleccionMovil, plansInfo]);

    useEffect(() => {
        const paquete = userAnswers.movil?.paquete;
        if (!paquete) {
            if (selectedCardId !== null) {
                setSelectedCardId(null);
            }
            return;
        }

        const matchedId = Number(paquete.idPaquete);
        if (selectedCardId !== matchedId) {
            setSelectedCardId(matchedId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAnswers.movil?.paquete?.idPaquete, plansInfo]);

    const onTabChange = (key: string) => {
        setSelectedTabKey(key);
    };

    useEffect(() => {
        const currentTab = plansInfo.find(tab => tab.tituloTab === selectedTabKey);
        if (!currentTab || !currentTab.cards || currentTab.cards.length === 0) return;

        if (trackedTabsRef.current.has(selectedTabKey)) return;

        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;
        const listId = `movil_${selectedTabKey}`;
        const listName = selectedTabKey;

        const items = currentTab.cards.map((card, index) =>
            buildPlanItem(
                {
                    id: String(card.idPaquete),
                    sku: card.nombreCode,
                    name: card.tituloTriplePlay ?? card.titulo,
                    category: "Bundle",
                    technology: card.titulo.includes("12 meses") ? "Contrato" : "Sin_Plazo",
                    price: card.precioPaquete,
                    speed: card.velocidadMinima,
                    channels: card.canales,
                    contractMonths: card.tiempoPlan,
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

        trackedTabsRef.current.add(selectedTabKey);
    }, [plansInfo, selectedTabKey]);

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className="w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center">
                    {step}
                </p>
                <h3 className="font-semibold text-xl leading-[24px] text-black-0">
                    {offersCopys.movil.titulo}
                </h3>
            </div>
            <h5 className="font-normal leading-[24px] text-base text-black-0">
                {offersCopys.movil.subTitulo}
            </h5>
            <div>
                <div className="flex w-full flex-col">
                    <Tabs
                        aria-label="Dynamic tabs"
                        items={plansInfo}
                        variant="light"
                        radius="none"
                        fullWidth={true}
                        defaultSelectedKey={defaultKey}
                        selectedKey={selectedTabKey}
                        onSelectionChange={(key) => onTabChange(key as string)}
                        classNames={{
                            tabContent: "group-data-[selected=true]:font-semibold group-data-[selected=true]:text-black-0 text-black-0 px-auto whitespace-normal font-medium leading-[24px] text-base",
                            panel: "w-full p-0",
                            tabList: "w-full mb-[24px] p-0 h-full flex items-center rounded-none overflow-y-hidden border-b-1 border-gray-150 gap-0",
                            cursor: "group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-b-gray-450 rounded-none shadow-none opacity-100",
                            base: "m-auto",
                            tab: "py-[8px] px-[12px] w-full h-[48px] rounded-none"
                        }}
                    >
                        {(item: MovilPlansInfo) => (
                            <Tab key={item.tituloTab} title={item.tituloTab} />
                        )}
                    </Tabs>

                    <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[16px] 2xl:gap-[24px] auto-rows-fr auto-cols-fr">
                        {plansInfo.find(tab => tab.tituloTab === selectedTabKey)?.cards.map((card: OfferItem, index) => {
                            const cardId = card.idPaquete;
                            const isSelected = String(selectedCardId) === String(cardId);

                            return (
                                <div
                                    key={index}
                                    className={`w-auto h-full rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                                >
                                    <Card
                                        isPressable
                                        onPress={() => handleSelect(cardId, card)}
                                        classNames={{
                                            base: "flex flex-col rounded-xs shadow-none h-full w-full",
                                            header: "pt-[16px] pb-0",
                                            body: "py-0 h-[48px]",
                                            footer: "pb-[16px] mt-[16px] pt-0"
                                        }}>
                                        <CardHeader>
                                            <div className="flex flex-col text-start">
                                                <h1 className="text-2xl font-extrabold leading-[27px]">{card.titulo}</h1>
                                            </div>
                                        </CardHeader>
                                        <CardBody />
                                        <CardFooter>
                                            <div className="flex flex-col w-full gap-[8px]">
                                                <div className="flex flex-row items-baseline text-start gap-[4px]">
                                                    {
                                                        userAnswers.internet?.paquete || userAnswers.tv?.paquete ? (
                                                            <>
                                                                <p className="font-normal text-sm line-through text-gray-200">{FormatCurrency(card.precioPaquete as string)}</p>
                                                                <div className="flex flex-row items-baseline">
                                                                    <p className="text-lg font-bold">{FormatCurrency(Number(card.precioPaquete) * 0.5)}</p>
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
                                                        <ConfiguradorCardsModalComponent
                                                            variables={{
                                                                velocidadMaxima: card.velocidadMaxima,
                                                                precioPaquete: card.precioPaquete,
                                                                plazoForzoso: card.plazoForzoso || false
                                                            }}
                                                            type="movil"
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
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}