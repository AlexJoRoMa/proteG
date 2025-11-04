'use client'

import LinkModal from "@/components/atoms/LinkModal";
import ConfiguradorCardsModalComponent from "@/components/layouts/modals/ConfiguradorCardsModalComponent";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { CheckPlanesIcon } from "@/constants/IconsConstants";
import { OfferItem, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

export default function PlanesInternet({ step }: StepProps) {

    const { configuradorEntry, setUserAnswers, disabled, userAnswers, copysConfigurador } = useContent();
    const { params } = useIzziContent();
    const plans = configuradorEntry?.offers?.DOBLE_PLAY;
    const offersCopys = copysConfigurador as unknown as OffersCopys;
    const coverageType = configuradorEntry?.coverageType.includes('FTTH') ? 'FTTH' : 'HFC';

    const plansPrev = plans as unknown as OfferItem[];


    const plansInfo: OfferItem[] = plansPrev.map(offer => {
        const totalAhorros = offer.izziAhorros?.reduce((acc, ahorro) => acc + Number(ahorro.monto), 0) || 0;
        const nuevoPrecio = (
            Number(offer.precioPaquete) -
            totalAhorros -
            Number(offer.descuentoPaquete || 0) -
            Number(offer.precioDomiciliacion || 0)
        ).toString();
        const precioTachado = (Number(offer.precioPaquete) - totalAhorros).toString();
        return {
            ...offer,
            precioPaquete: nuevoPrecio,
            precioTachado: precioTachado
        };
    })

    const mapOffersByType = {
        hfc: [
            80,
            100,
            150
        ],
        ftth: [
            80,
            100,
            200,
            1000
        ]
    }

    const offersByType = plansInfo.filter((plan: OfferItem) => coverageType == 'HFC' ? mapOffersByType.hfc.includes(plan.velocidadMinima as number) : mapOffersByType.ftth.includes(plan.velocidadMinima as number));
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    function handleSelect(index: number, card: OfferItem) {

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
                total: Number(card.precioPaquete) || 0
            }

        }))
    }

    function clearSelection() {
        setSelectedIndex(null);
        setUserAnswers(prev => {
            const newState = { ...prev };
            delete newState.internet;
            return newState;
        });
    }

    useEffect(() => {
        if (disabled && (userAnswers.internet?.paquete !== null)) {
            setSelectedIndex(null);
            setUserAnswers(prev => {
                const newState = { ...prev };
                delete newState.internet;
                return newState;
            });
        }
    }, [disabled, setUserAnswers, userAnswers.internet?.paquete])

    const offersIds = useMemo(() => offersByType.map(offer => String(offer.idPaquete)).join('|'),
        [offersByType]
    );

    useEffect(() => {
        if (!params.plan || !offersByType.length) return;

        // split para triplePlay: 'izzi80m_izzitvhd' -> ['izzi80m', 'izzitvhd']
        const [internetCode, tvCode] = String(params.plan).split('_', 2);

        let matchedOffer = offersByType.find(offer => offer.nombreCode === params.plan);

        if (!matchedOffer && internetCode) {
            matchedOffer = offersByType.find(offer => offer.nombreCode === internetCode);
        }
        if (!matchedOffer) return;

        const matchedId = String(matchedOffer.idPaquete);
        const currentInternetId = String(userAnswers.internet?.paquete?.idPaquete ?? '');

        if (currentInternetId === matchedId) {
            const index = offersByType.findIndex(offer => String(offer.idPaquete) === matchedId);
            if (index !== -1 && selectedIndex !== index) {
                setSelectedIndex(index);
            }
            return;
        }
        const index = offersByType.findIndex(offer => String(offer.idPaquete) === matchedId);
        if (index !== -1 ) {
            setSelectedIndex(index);
        }

        setUserAnswers(prev => ({
            ...prev,
            internet: {
                paquete: matchedOffer,
                total: Number(matchedOffer.precioPaquete) || 0,
            },
        }));

        if (tvCode) {
            const tvCatalog = configuradorEntry?.offers.TRIPLE_PLAY ?? [];
            const matchedTv = (tvCatalog as any[]).find(tv => tv.nombreCode === tvCode);

            if(matchedTv) {
                const currentTvId = String(userAnswers.tv?.paquete?.idPaquete ?? '');
                const matchedTvId = String(matchedTv.idPaquete);

                if (currentTvId !== matchedTvId) {
                    setUserAnswers(prev => ({
                        ...prev,
                        tv: {
                            paquete: matchedTv,
                            total: Number(matchedTv.precioPaquete) || 0,
                        },
                    }));
                }
            }
        }

    }, [params.plan, offersIds, userAnswers.internet?.paquete?.idPaquete, userAnswers.tv?.paquete?.idPaquete, selectedIndex]);

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
                    offersByType && offersByType.map((card: OfferItem, index) => {
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
                                            {card.extrasIncluidos &&
                                                <p className="leading-[18px] font-normal text-sm text-gray-300">{card?.extrasIncluidos[0].titulo}</p>
                                            }
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="flex flex-col w-full gap-[8px]">
                                            <div className="flex flex-row items-baseline gap-[4px]">
                                                <span className="text-sm font-normal text-gray-200 line-through">{FormatCurrency(card.precioTachado as string)}</span>
                                                <div className="flex flex-row items-baseline">
                                                    <span className="text-lg font-bold">{FormatCurrency(card.precioPaquete)}</span>
                                                    <span className="text-sm font-normal">{`/${card.periodicidad}`}</span>
                                                </div>
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
                                                            velocidadMinima: card.velocidadMinima,
                                                            velocidadMaxima: card.velocidadMaxima,
                                                            precioPaquete: card.precioPaquete,
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
    )
}