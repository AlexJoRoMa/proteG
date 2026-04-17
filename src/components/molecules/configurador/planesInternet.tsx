'use client'

import LinkModal from "@/components/atoms/LinkModal";
import ConfiguradorCardsModalComponent from "@/components/layouts/modals/ConfiguradorCardsModalComponent";
import { CheckPlanesIcon } from "@/constants/IconsConstants";
import { movilComponentFields, OfferItem, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useEffect, useMemo, useRef } from "react";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS, CURRENCY } from "@/lib/tracking/constants";

export default function PlanesInternet({ step, preSeleccion }: StepProps) {
    const { configuradorEntry, setUserAnswers, disabled, userAnswers, copysConfigurador, rehydrated } = useContent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const plans = configuradorEntry?.offers?.DOBLE_PLAY as OfferItem[] || [];
    const offersCopys = copysConfigurador as unknown as OffersCopys;
    const coverageType = configuradorEntry?.coverageType.includes('FTTH') ? 'FTTH' : 'HFC';

    const plansInfo = useMemo(() => {
        return (plans || []).map(offer => {
            const totalAhorros = offer.izziAhorros?.reduce((acc, ahorro) => acc + Number(ahorro.monto), 0) || 0;
            const nuevoPrecio = (Number(offer.precioPaquete) - totalAhorros - Number(offer.descuentoPaquete || 0)).toString();
            const precioTachado = (Number(offer.precioPaquete) - totalAhorros).toString();
            return { ...offer, precioPaquete: nuevoPrecio, precioTachado };
        });
    }, [plans]);

    const mapOffersByType = useMemo(() => ({
        hfc: [80, 100, 150],
        ftth: [80, 100, 200, 1000]
    }), []);

    const offersByType = useMemo(() => {
        return plansInfo.filter((plan) =>
            coverageType === 'HFC'
                ? mapOffersByType.hfc.includes(plan.velocidadMinima as number)
                : mapOffersByType.ftth.includes(plan.velocidadMinima as number)
        );
    }, [plansInfo, coverageType, mapOffersByType]);
    
    const selectedIndex = useMemo(() => {
        const paquete = userAnswers.internet?.paquete;
        if (!paquete) return null;

        return offersByType.findIndex(
            offer => String(offer.idPaquete) === String(paquete.idPaquete)
        );
    }, [userAnswers.internet?.paquete, offersByType]);

    const userInteracted = useRef(false);
    const viewListTrackedRef = useRef(false);

    const listId = "internet";
    const listName = offersCopys.internet.titulo;

    function trackPlanDetailView(card: OfferItem, index: number) {
        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;
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

    function handleSelect(index: number, card: OfferItem) {
        userInteracted.current = true;

        const isSelected = selectedIndex === index;

        if (isSelected) {
            setUserAnswers(prev => {
                const newState = { ...prev };
                delete newState.internet;
                return newState;
            });
            return;
        }

        setUserAnswers(prev => ({
            ...prev,
            internet: {
                paquete: card,
                total: Number(card.precioPaquete) || 0
            }
        }));

        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;

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
    }

    useEffect(() => {
        if (disabled && (userAnswers.internet?.paquete !== null)) {
            setUserAnswers(prev => {
                const newState = { ...prev };
                delete newState.internet;
                return newState;
            });
        }
    }, [disabled, setUserAnswers, userAnswers.internet?.paquete]);

    const offersIds = useMemo(
        () => offersByType.map(o => String(o.idPaquete)).join('|'),
        [offersByType]
    );

    useEffect(() => {
        if (viewListTrackedRef.current) return;
        if (!offersByType || offersByType.length === 0) return;

        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;

        const items = offersByType.map((offer, index) =>
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
    }, [offersByType, listId, listName]);

    useEffect(() => {
        if (!preSeleccion.seleccionPaquete) return;
        if (!offersByType.length) return;
        if (userAnswers.internet?.paquete) return;
        if (userInteracted.current) return;

        const [internetCode] = String(preSeleccion.seleccionPaquete).split('_', 2);
        let matchedOffer = offersByType.find(o => String(o.nombreCode) === String(preSeleccion.seleccionPaquete));

        if (!matchedOffer && internetCode) {
            matchedOffer = offersByType.find(o => String(o.nombreCode) === String(internetCode));
        }

        if (!matchedOffer) return;

        setUserAnswers(prev => ({
            ...prev,
            internet: {
                paquete: matchedOffer!,
                total: Number(matchedOffer!.precioPaquete) || 0
            }
        }));

    }, [preSeleccion.seleccionPaquete, offersIds, rehydrated, offersByType, userAnswers.internet?.paquete, setUserAnswers]);

    const hasMovil = useMemo(() => {
        const movil = userAnswers.movil as unknown as movilComponentFields;
        return !!movil && Object.keys(movil).length > 0;
    }, [userAnswers.movil]);

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className={`w-[40px] h-[40px] ${!disabled ? 'text-white-0 bg-black-0' : 'text-gray-200 bg-gray-50'} rounded-full font-semibold text-base leading-[24px] flex justify-center items-center`}>{step}</p>
                <h3 className={`font-semibold text-xl leading-[24px] ${!disabled ? 'text-black-0' : 'text-gray-200'}`}>{offersCopys.internet.titulo}</h3>
            </div>

            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[16px] 2xl:gap-[24px] auto-rows-fr">
                {
                    offersByType && offersByType.map((card: OfferItem, index) => {
                        const isSelected = selectedIndex === index;

                        return (
                            <div
                                key={card.idPaquete}
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

                                            <p className={`text-base font-normal leading-[27px] ${card.velocidadMinima === card.velocidadMaxima ? 'invisible' : ''}`}>{`${offersCopys.internet.cards.preVelocidad} ${card.velocidadMinima} ${offersCopys.internet.cards.posVelocidad}`}</p>
                                            <p className="leading-[27px] font-extrabold text-2xl">{`${card.velocidadMaxima} ${offersCopys.internet.cards.unidadVelocidad}`}</p>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex items-stretch">
                                            {card.extrasIncluidos &&
                                                <p className="leading-[18px] font-normal text-sm text-gray-300">
                                                    {`${offersCopys.internet.cards.extrasIncluidos} `}
                                                    {card?.extrasIncluidos.map((item) => item.titulo).join(', ')}
                                                    {'.'}
                                                </p>
                                            }
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="flex flex-col w-full gap-[8px]">
                                            <div className="flex flex-row items-baseline gap-[4px]">
                                                {
                                                    hasMovil ? (
                                                        <div className="flex flex-row items-baseline">
                                                            <span className="text-lg font-bold">{FormatCurrency(card.precioTachado as string)}</span>
                                                            <span className="text-sm font-normal">{`/${card.periodicidad}`}</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-normal text-gray-200 line-through">{FormatCurrency(card.precioTachado as string)}</span>
                                                            <div className="flex flex-row items-baseline">
                                                                <span className="text-lg font-bold">{FormatCurrency(card.precioPaquete)}</span>
                                                                <span className="text-sm font-normal">{`/${card.periodicidad}`}</span>
                                                            </div>
                                                        </>
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
                                                            velocidadMinima: card.velocidadMinima,
                                                            velocidadMaxima: card.velocidadMaxima,
                                                            precioPaquete: card.precioPaquete,
                                                            extras: card.extrasIncluidos
                                                        }}
                                                        type="internet"
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
        </div>
    );
}