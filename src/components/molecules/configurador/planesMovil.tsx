'use client'

import { ComponentsFields, ConfigCardsFields, ConfigDataFields, PlansCardProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { Entry, EntrySkeletonType } from "contentful";
import { useState } from "react";

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

export default function PlanesMovil() {

    const content = useContent();
    const entryContent = content.pageEntry?.fields.steps as unknown as EntrySkeletonType<ConfigDataFields>[];
    const plans = entryContent[3];


    const plansStep = plans?.fields.stepNumber;
    const plansTitle = plans?.fields.title;
    const plansComponents = plans?.fields.components[0] as unknown as Entry<EntrySkeletonType, undefined, string> | null;

    const plansInfo = plansComponents?.fields.tabs as unknown as EntrySkeletonType<ConfigCardsFields>[];
    const defaultKey = plansInfo[0]?.fields.entryTitle;

    const [selectedTabKey, setSelectedTabKey] = useState<string>(defaultKey);
    const [selectedCardsByTab, setSelectedCardsByTab] = useState<Record<string, string[]>>({});

    function handleSelect(tabKey: string, cardId: string) {
        setSelectedCardsByTab((prev) => {
            const currentSelected = prev[tabKey] || []
            const isAlreadySelected = currentSelected.includes(cardId);

            const updateSelected = isAlreadySelected ?
                currentSelected.filter((id) => id !== cardId) :
                [...currentSelected, cardId]

            return {
                ...prev,
                [tabKey]: updateSelected
            }
        });
    }

    //TODO: const data = contenfulData || integracionData || seleccion del usuario ;  <- data base, de integracion o del usuario


    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{plansStep}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{plansTitle}</h3>
            </div>
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
                        {(item: EntrySkeletonType<ConfigCardsFields>) => (
                            <Tab
                                key={item.fields.entryTitle}
                                title={item.fields.entryTitle}
                            />
                        )}
                    </Tabs>
                    <div className="grid grid-cols-2 gap-[16px]">
                        {plansInfo.find((tab) => tab.fields.entryTitle === selectedTabKey)?.fields.cards.map((card: ComponentsFields, index) => {
                            const cardId = card.sys.id;
                            const isSelected = selectedCardsByTab[selectedTabKey]?.includes(cardId);

                            return (
                                <div
                                    key={`card-${index}`}
                                    className={`w-auto h-fit rounded-sm p-[4px] ${isSelected ? 'bg-conic-custom' : 'border !rounded-md border-gray-150'}`}
                                >
                                    <Card
                                        isPressable
                                        onPress={() => handleSelect(selectedTabKey, cardId)}
                                        classNames={{
                                            base: "flex flex-col gap-[65px] rounded-xs shadow-none h-auto w-full",
                                            header: "px-[16px] pt-[16px] pb-0",
                                            body: "px-[16px] pb-[16px] pt-0"
                                        }}>
                                        <CardHeader>
                                            <div className="flex flex-col">
                                                <h1 className="text-2xl font-extrabold leading-[27px]">{card.fields.title}</h1>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="flex flex-col">
                                                <div>
                                                    <span className="text-lg font-bold">{`$${card.fields.price}`}</span>
                                                    <span className="text-sm font-normal">{" /mes"}</span>
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
                                                        className={`w-[24px] h-[24px] rounded-sm border flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-white-0 border-gray-150'}`}
                                                        aria-pressed={isSelected}
                                                    >
                                                        {isSelected && <CheckIcon className="w-[16px] h-[16px] text-white-0" />}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardBody>
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
