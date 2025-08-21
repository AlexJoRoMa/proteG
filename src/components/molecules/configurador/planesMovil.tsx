'use client'

import { ComponentsFields, ConfigCardsFields, StepProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { Card, CardBody, CardFooter, CardHeader, Tab, Tabs } from "@heroui/react";
import { Entry, EntrySkeletonType } from "contentful";
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

    const { configuradorEntry, setUserAnswers, disabled, userAnswers } = useContent();
    const plans = configuradorEntry?.movil && configuradorEntry?.movil;

    const plansComponents = plans?.fields.components[0] as unknown as Entry<EntrySkeletonType, undefined, string> | null;

    const plansInfo = plansComponents?.fields.tabs as unknown as EntrySkeletonType<ConfigCardsFields>[];
    const defaultKey = plansInfo[0]?.fields.entryTitle;

    const [selectedTabKey, setSelectedTabKey] = useState<string>(defaultKey);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    function handleSelect(cardId: string, card: ComponentsFields) {

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
                total: card.fields.discountPrice ? Number(card.fields.discountPrice) || 0 : Number(card.fields.price) || 0
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
                    {plans?.fields.title}
                </h3>
            </div>
            <h5 className={`font-normal leading-[24px] text-base ${!disabled ? 'text-black-0' : 'text-gray-200'}`}>
                {plans?.fields.subTitle}
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
                        {(item: EntrySkeletonType<ConfigCardsFields>) => (
                            <Tab
                                key={item.fields.entryTitle}
                                title={item.fields.entryTitle}
                            />
                        )}
                    </Tabs>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] md:gap-[24px] auto-rows-fr">
                        {plansInfo.find((tab) => tab.fields.entryTitle === selectedTabKey)?.fields.cards.map((card: ComponentsFields, index) => {
                            const cardId = card.sys.id;
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
                                                <h1 className="text-2xl font-extrabold leading-[27px]">{card.fields.title}</h1>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                        </CardBody>
                                        <CardFooter>
                                            <div className="flex flex-col w-full gap-[8px]">
                                                <div className="flex flex-row items-baseline text-start gap-[4px]">
                                                    {card.fields.discountPrice ?
                                                        <>
                                                            <p className="font-normal text-sm line-through text-gray-200">{`$${card.fields.price}`}</p>
                                                            <div className="flex flex-row items-baseline">
                                                                <p className="text-lg font-bold">{`$${card.fields.discountPrice}`}</p>
                                                                <p className="text-sm font-normal">{card.fields.afterPrice}</p>
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            {card.fields.beforePrice && <p className="text-sm font-normal">{card.fields.beforePrice}</p>}
                                                            <div className="flex flex-row items-baseline">
                                                                <p className="text-lg font-bold">{`$${card.fields.price}`}</p>
                                                                <p className="text-sm font-normal">{card.fields.afterPrice}</p>
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
                                                    >{card.fields.ctaText}</p>
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
