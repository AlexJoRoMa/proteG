'use client'

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TabsData } from "@/types/TabsTypes";
import Image from "next/image";

export default function TabContent(tabsData: any) {

    const tabs = tabsData.tabsData;

    return (
        <Tabs
            aria-label="Dynamic tabs"
            items={tabs.tabs}
            variant="light"
            radius="md"
            fullWidth={true}
            classNames={{
                tabContent: "group-data-[selected=true]:font-medium group-data-[selected=true]:text-white text-white lg:py-[20px] px-auto lg:w-[246px] whitespace-normal font-medium !rounded-t-sm leading-[24px] text-base",
                panel: "bg-gray-450 w-full p-0",
                tabList: "w-auto flex items-center pb-0 rounded-none",
                cursor: "bg-gray-450 rounded-none rounded-t-sm",
                base: "m-auto flex items-center justify-around",
                tab: "h-[56px] lg:h-[48px] w-[118px] lg:w-full rounded-none"
            }}>
            {(item: TabsData) => (
                <Tab key={item.fields.entryTitle} title={item.fields.entryTitle}>
                    <Card className="rounded-none bg-gray-450 shadow-none">
                        <CardBody className="grid grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[32px] px-[24px] pt-[48px] pb-[51px] lg:pt-[28px] lg:pb-[16px] h-[787px] lg:h-[374px] items-stretch">
                            {item.fields.cards.map((card) => {

                                return (
                                    <div key={card.sys.id} className="flex flex-col gap-[32px] items-center text-center lg:w-[290px] lg:p-[8px] flex-grow h-full">
                                        <div className="flex flex-col flex-grow w-full gap-[32px]">
                                            <div className=" flex justify-center w-full">
                                                <Image
                                                    className="w-[64px] h-[64px] lg:w-[86px] lg:h-[86px]"
                                                    src={`https:${card.fields.image.fields.image.fields.file.url}`}
                                                    alt={card.fields.image.fields.altText}
                                                    priority={false}
                                                    loading="lazy"
                                                    width={64}
                                                    height={64}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-[16px] text-white">
                                                <h4 className="font-medium text-xl leading-[24px] line-clamp-3 lg:line-clamp-2 min-h-[72px] lg:min-h-[48px]">{card.fields.entryTitle}</h4>
                                                <div className="flex flex-col gap-[24px]">
                                                    <p className="font-light text-gray-200 text-base leading-[24px] ">{card.fields.entryBody}</p>
                                                    {card.fields.entryUserTestimony && (
                                                        <p className="font-light text-gray-200 text-base leading-[24px]">
                                                            - {card.fields.entryUserTestimony}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                )
                            })}
                        </CardBody>
                    </Card>
                </Tab>
            )}
        </Tabs>
    )
}