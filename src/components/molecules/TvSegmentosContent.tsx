'use client'

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TabsContentProps, TabsDataFields, CardSegmentoFields } from '@/types/TvCanalesSegmentosTypes';
import Image from "next/image";
import { Entry, EntrySkeletonType } from "contentful";

export default function SegmentosCanales({ tabsData }: TabsContentProps) {

    const cardsInfo = tabsData as unknown as EntrySkeletonType<TabsDataFields>[];
    const defaultKey = cardsInfo?.[0]?.fields.entryTitle;

    /* console.log('>>>>>> cardsInfo', cardsInfo); */
    return(
        <Tabs
        aria-label="Dynamic tabs"
        items={cardsInfo}
        radius="md"
        fullWidth={true}
        defaultSelectedKey={defaultKey}
        classNames={{
                tabContent: "group-data-[selected=true]:font-medium group-data-[selected=true]:text-black text-black lg:py-[20px] px-auto lg:w-[246px] whitespace-normal font-medium font-bold !rounded-t-sm leading-[24px] text-base",
                panel: "bg-white w-full p-0",
                tabList: "w-auto flex items-center pb-0 rounded-none overflow-y-hidden",
                cursor: "bg-white rounded-none rounded-t-sm",
                base: "m-auto flex items-center justify-around",
                tab: "h-[56px] lg:h-[48px] w-[118px] lg:w-full rounded-none"
            }}
        >
        {(item: EntrySkeletonType<TabsDataFields>) => (
            <Tab key={item.fields.entryTitle} title={item.fields.entryTitle}>
                <Card className="rounded-none  shadow-none md:mx-md 2xl:mx-xl">
                    <CardBody className="">
                        {item.fields.cards.map((card) => {
                            const segmentoItem = card as unknown as Entry<EntrySkeletonType<CardSegmentoFields>>;
                            const segmentoData = card?.fields as CardSegmentoFields; 

                            console.log('>>>>>> segmentoData', segmentoData);
                            return(
                                <div key={segmentoItem.sys.id}>
                                    <div>
                                        {/* titulo del segmento */}
                                        <div className="text-[20px] leading-[24px] font-bold">
                                            <p>{segmentoData.titulo}</p>
                                        </div>

                                        {/* Grid de iconos */}
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
    );
}
