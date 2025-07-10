'use client'

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TabsDataFields, CardDataFields, TabsContentProps } from "@/types/TabsTypes";
import Image from "next/image";
import { Entry, EntrySkeletonType } from "contentful";

export default function PageTabContent({ tabsData }: TabsContentProps) {

    const cardsInfo = tabsData as unknown as EntrySkeletonType<TabsDataFields>[];

    return (
        <Tabs
            aria-label="Dynamic tabs"
            items={cardsInfo}
            variant="light"
            radius="md"
            fullWidth={true}
            destroyInactiveTabPanel
            classNames={{
                tabContent: "group-data-[selected=true]:font-medium group-data-[selected=true]:text-white text-white lg:py-[20px] px-auto lg:w-[246px] whitespace-normal font-medium !rounded-t-sm leading-[24px] text-base",
                panel: "bg-gray-450 w-full p-0",
                tabList: "w-auto flex items-center pb-0 rounded-none",
                cursor: "bg-gray-450 rounded-none rounded-t-sm",
                base: "m-auto flex items-center justify-around",
                tab: "h-[56px] lg:h-[48px] w-[118px] lg:w-full rounded-none"
            }}>
            {(item: EntrySkeletonType<TabsDataFields>) => (
                <Tab key={item.fields.entryTitle} title={item.fields.entryTitle}>
                    <Card className="rounded-none bg-gray-450 shadow-none lg:mx-[200px]">
                        <CardBody className="grid grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[32px] px-[24px] pt-[48px] pb-[51px] lg:pt-[28px] lg:pb-[16px] h-[787px] lg:h-min items-stretch">
                            {item.fields.cards.map((card) => {
                                const cardItem = card as unknown as Entry<EntrySkeletonType<CardDataFields>>;
                                const cardData = card?.fields as CardDataFields;

                                return (
                                    <div key={cardItem.sys.id} className="flex flex-col gap-[32px] items-center text-center lg:w-auto lg:p-[8px] flex-grow h-full">
                                        <div className="flex flex-col flex-grow w-full gap-[32px]">
                                            <div className=" flex justify-center w-full">
                                                <Image
                                                    className="w-[64px] h-[64px] lg:w-[86px] lg:h-[86px]"
                                                    src={`https:${cardData.image.fields.image.fields.file.url}`}
                                                    alt={cardData.image.fields.altText}
                                                    priority={false}
                                                    loading="lazy"
                                                    width={64}
                                                    height={64}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-[16px] text-white">
                                                <h4 className="font-medium text-xl leading-[24px] line-clamp-3 xl:line-clamp-2 min-h-[72px] xl:min-h-[48px]">{cardData.entryTitle}</h4>
                                                <div className="flex flex-col gap-[24px]">
                                                    <p className="font-light text-gray-200 text-base leading-[24px] ">{cardData.entryBody}</p>
                                                    {cardData.entryUserTestimony && (
                                                        <p className="font-light text-gray-200 text-base leading-[24px]">
                                                            - {cardData.entryUserTestimony}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </CardBody>
                    </Card>
                </Tab>
            )}
        </Tabs>
    )
}