'use client'

import { ComponentsFields, MovilPlansInfo, OffersCopys, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Card, CardBody, CardFooter, CardHeader, Tab, Tabs } from "@heroui/react";
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

export default function PlanesMovil({ step }: StepProps) {

    const { configuradorEntry, setUserAnswers, disabled, userAnswers, copysConfigurador } = useContent();
    const plans = configuradorEntry?.offers.MOVIL as unknown as ComponentsFields[];
    const offersCopys = copysConfigurador as unknown as OffersCopys;

    const plansInfo = formatData(plans, offersCopys) as unknown as MovilPlansInfo[];
    console.log('movil', plansInfo)

    const defaultKey = plansInfo[0].tituloTab;

    const [selectedTabKey, setSelectedTabKey] = useState<string>(defaultKey);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    function formatData(data: ComponentsFields[], copys: OffersCopys) {

        const contrato12 = data.filter(item => item.titulo.includes("12 meses"));
        const sinPlazo = data.filter(item => !item.titulo.includes("12 meses"));

        const resultado = [
            { tituloTab: copys.movil.tabs.contrato, cards: contrato12 },
            { tituloTab: copys.movil.tabs.sinPlazo, cards: sinPlazo }
        ];

        return resultado;
    }

    function handleSelect(cardId: number, card: ComponentsFields) {

        if (selectedCardId !== null) {
            if (selectedCardId === cardId) {
                setSelectedCardId(null);
                setUserAnswers(prev => {
                    const { movil, ...rest } = prev;
                    return rest
                });
                return;
            }
        }

        setSelectedCardId(cardId);
        setUserAnswers(prev => ({
            ...prev,
            movil: {
                paquete: card,
                contrato: selectedTabKey,
                total: card.precioAhorro ? Number(card.precioAhorro) || 0 : Number(card.precioPaquete) || 0
            },
        }))
    }

    useEffect(() => {
        if (disabled && (userAnswers.internet?.paquete !== null)) {
            setSelectedCardId(null);
            setUserAnswers(prev => {
                const { movil, ...rest } = prev;
                return rest
            });
        }
    }, [disabled])

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className={`w-[40px] h-[40px]  ${!disabled ? 'text-white-0 bg-black-0' : 'text-gray-200 bg-gray-50'} rounded-full font-semibold text-base leading-[24px] flex justify-center items-center`}>
                    {step}
                </p>
                <h3 className={`font-semibold text-xl leading-[24px] ${!disabled ? 'text-black-0' : 'text-gray-200'}`}>
                    {offersCopys.movil.titulo}
                </h3>
            </div>
            <h5 className={`font-normal leading-[24px] text-base ${!disabled ? 'text-black-0' : 'text-gray-200'}`}>
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
                        isDisabled={disabled}
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
                        {plansInfo.find((tab) => tab.tituloTab === selectedTabKey)?.cards.map((card: ComponentsFields, index) => {
                            const cardId = card.idPaquete;
                            const isSelected = selectedCardId === cardId;

                            return (
                                <div
                                    key={index}
                                    className={`w-auto h-full rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                                >
                                    <Card
                                        isPressable={!disabled}
                                        onPress={() => handleSelect(cardId, card)}
                                        isDisabled={disabled}
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
                                                    {card.precioAhorro ?
                                                        <>
                                                            <p className="font-normal text-sm line-through text-gray-200">{FormatCurrency(card.precioPaquete)}</p>
                                                            <div className="flex flex-row items-baseline">
                                                                <p className="text-lg font-bold">{FormatCurrency(card.precioAhorro)}</p>
                                                                <p className="text-sm font-normal">{offersCopys.movil.cards.periodo}</p>
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <div className="flex flex-row items-baseline">
                                                                <p className="text-lg font-bold">{FormatCurrency(card.precioPaquete)}</p>
                                                                <p className="text-sm font-normal">{offersCopys.movil.cards.periodo}</p>
                                                            </div>
                                                        </>}

                                                </div>
                                                <div className="flex flex-row gap-[16px] items-center justify-between">
                                                    <p
                                                        className="underline pointer-events-auto"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            console.log('click!!!')
                                                        }}
                                                    >{offersCopys.movil.cards.info}</p>
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
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
