'use client'

import LinkModal from "@/components/atoms/LinkModal";
import ConfiguradorCardsModalComponent from "@/components/layouts/modals/ConfiguradorCardsModalComponent";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { CheckPlanesIcon } from "@/constants/IconsConstants";
import { MovilPlansInfo, OfferItem, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader, Tab, Tabs } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

export default function PlanesMovil({ step }: StepProps) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { configuradorEntry, setUserAnswers, userAnswers, copysConfigurador } = useContent();
    const { params } = useIzziContent();
    const plans = configuradorEntry?.offers.MOVIL as unknown as OfferItem[];
    const offersCopys = copysConfigurador as unknown as OffersCopys;

    const plansPrev = formatData(plans, offersCopys) as unknown as MovilPlansInfo[];


    const plansInfo = plansPrev.map(offer => {
        const cardsActualizadas = offer.cards?.map(card => {
            const precioTachado = Number(card.precioPaquete) * 0.5;

            return {
                ...card,
                precioPaquete: precioTachado.toString(),
                precioTachado: card.precioPaquete
            };
        }) ?? [];

        return {
            ...offer,
            cards: cardsActualizadas
        };
    });


    const defaultKey = plansInfo[0].tituloTab;

    const [selectedTabKey, setSelectedTabKey] = useState<string>(defaultKey);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    function formatData(data: OfferItem[], copys: OffersCopys) {

        const contrato12 = data.filter(item => item.titulo.includes("12 meses"));
        const sinPlazo = data.filter(item => !item.titulo.includes("12 meses"));

        const resultado = [
            { tituloTab: copys.movil.tabs.contrato, cards: contrato12 },
            { tituloTab: copys.movil.tabs.sinPlazo, cards: sinPlazo }
        ];

        return resultado;
    }

    function handleSelect(cardId: number, card: OfferItem) {

        if (selectedCardId !== null) {
            if (selectedCardId === cardId) {
                clearSelection();
                return;
            }
        }

        setSelectedCardId(cardId);
        setUserAnswers(prev => ({
            ...prev,
            movil: {
                paquete: card,
                contrato: selectedTabKey,
                total: Number(card.precioPaquete) || 0
            },
        }))
    }

    function clearSelection() {
        setSelectedCardId(null);
        setUserAnswers(prev => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { movil, ...rest } = prev;
            return rest
        });
    }

    const movilOffersIds = useMemo(() => {
        const allCards = plansInfo.flatMap(tab => tab.cards ?? []);
        return allCards.map(card => String(card.idPaquete)).join('|');
    }, [plansInfo]);

    useEffect(() => {
        if (!params.movil) return;

        const mobileCode = String(params.movil);
        if (!plansInfo || plansInfo.length === 0) return;

        const allCards = plansInfo.flatMap(tab => tab.cards ?? []);
        const matched = allCards.find(card => card.nombreCode === mobileCode);
        if (!matched) return;

        const matchedId = String(matched.idPaquete);
        const currentId = String(userAnswers.movil?.paquete?.idPaquete ?? '');

        if (currentId === matchedId) {
            const parentTab = plansInfo.find(tab => tab.cards?.some(card => String(card.idPaquete) === matchedId));
            if (parentTab && parentTab.tituloTab !== selectedTabKey) {
                setSelectedTabKey(parentTab.tituloTab);
            }
            if (selectedCardId !== matched.idPaquete) {
                setSelectedCardId(matched.idPaquete);
            }
            return;
        }

        setUserAnswers(prev => ({
            ...prev,
            movil: {
                paquete: matched,
                total: Number(matched.precioPaquete) || 0,
            },
        }));

        const parentTab = plansInfo.find(tab => tab.cards.some(card => String(card.idPaquete) === matchedId));
        if (parentTab) {
            setSelectedTabKey(parentTab.tituloTab);
        }
        setSelectedCardId(matched.idPaquete);

    }, [movilOffersIds, params.movil, userAnswers.movil?.paquete?.idPaquete]);

    useEffect(() => {
        const movilPaquete = userAnswers.movil?.paquete;
        if (!movilPaquete || !plansInfo.length) return;

        const parentTab = plansInfo.find(tab =>
            tab.cards?.some(card => card.idPaquete === movilPaquete.idPaquete)
        );

        if (parentTab && parentTab.tituloTab) {
            setSelectedTabKey(parentTab.tituloTab);
        }

        setSelectedCardId(movilPaquete.idPaquete);
    }, [userAnswers.movil?.paquete, plansInfo]);

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className="w-[40px] h-[40px] text-white-0 bg-black-0  rounded-full font-semibold text-base leading-[24px] flex justify-center items-center">
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
                        onSelectionChange={(key) => setSelectedTabKey(key as string)}
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
                            <Tab
                                key={item.tituloTab}
                                title={item.tituloTab}
                            />
                        )}
                    </Tabs>
                    <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[16px] 2xl:gap-[24px] auto-rows-fr auto-cols-fr">
                        {plansInfo.find((tab) => tab.tituloTab === selectedTabKey)?.cards.map((card: OfferItem, index) => {
                            const cardId = card.idPaquete;
                            const isSelected = selectedCardId === cardId;

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
                                                <h1 className="text-2xl font-extrabold leading-[27px] 2xl:text-[21px] 3xl:text-2xl 4xl:leading-[32px]">{card.titulo}</h1>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                        </CardBody>
                                        <CardFooter>
                                            <div className="flex flex-col w-full gap-[8px]">
                                                <div className="flex flex-row items-baseline text-start gap-[4px]">
                                                    <>
                                                        <div className="flex flex-row items-baseline">
                                                            {
                                                                card.precioTachado ?
                                                                    <>
                                                                        <p className="font-normal text-sm line-through text-gray-200">{FormatCurrency(card.precioTachado)}</p>
                                                                        <p className="text-lg font-bold">{FormatCurrency(card.precioPaquete as string)}</p>
                                                                    </>
                                                                    :
                                                                    <p className="text-lg font-bold">{FormatCurrency(card.precioPaquete)}</p>
                                                            }
                                                            <p className="text-sm font-normal">{`/${card.periodicidad}`}</p>
                                                        </div>
                                                    </>

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
                                                                velocidadMaxima: card.velocidadMaxima,
                                                                precioPaquete: card.precioPaquete,
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
    )
}
