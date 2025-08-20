'use client'

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TabsContentProps, TabsDataFields, CardSegmentoFields } from '@/types/TvCanalesSegmentosTypes';
import Image from "next/image";
import { Asset, Entry, EntrySkeletonType } from "contentful";

export default function SegmentosCanales({ tabsData }: TabsContentProps) {

    const cardsInfo = tabsData as unknown as Entry<EntrySkeletonType<TabsDataFields>>[] | undefined;
    const defaultKey = cardsInfo?.[0]?.fields.entryTitle as string | undefined;


    return(
        <Tabs
        aria-label="Dynamic tabs"
        items={cardsInfo}
        radius="md"
        fullWidth={true}
        defaultSelectedKey={defaultKey}
        classNames={{
                tabContent: " group-data-[selected=true]:font-medium group-data-[selected=true]:text-black group-data-[selected=true]:font-bold  text-black lg:py-[20px] px-auto lg:w-[246px] whitespace-normal font-medium !rounded-t-sm leading-[24px] text-base",
                panel: "bg-white w-full p-0",
                tabList: " w-auto flex items-center pb-0 rounded-none overflow-y-hidden",
                cursor: "bg-white rounded-none rounded-t-sm",
                base: "m-auto flex items-center justify-around ",
                tab: "h-[56px] lg:h-[48px] w-[118px] lg:w-[400px] rounded-none"
            }}
        >
        {(item: Entry<EntrySkeletonType<TabsDataFields>>) => {
            const tabTittle = item.fields.entryTitle as unknown as string ;
            return(
            <Tab key={tabTittle} title={tabTittle}>
                <Card className="rounded-none  shadow-none md:mx-md 2xl:mx-xl">
                    <CardBody className="">
                        {Array.isArray(item.fields.cards) && item.fields.cards.map((card: Entry<EntrySkeletonType<CardSegmentoFields>>) => {
                            
                            const segmentoData = card?.fields as CardSegmentoFields; 

                            return(
                                <div key={card.sys.id}>
                                    <div className="border-gradient-verde">
                                        {/* titulo del segmento */}
                                        <div className="text-[20px] leading-[24px] font-bold">
                                            <p>{segmentoData.titulo}</p>
                                        </div>

                                        {/* Grid de iconos */}
                                        <div className="ring ring-red-500">
                                            {segmentoData.segmentoCanal && segmentoData.segmentoCanal.map((canalEntry: Entry<EntrySkeletonType>) =>{
                                                const asset = canalEntry?.fields?.image as unknown as Asset;
                                                const imgURL = asset?.fields?.file?.url;

                                                return(
                                                    <div key={canalEntry.sys.id}>
                                                        <Image 
                                                        src={`https:${imgURL}`}
                                                        alt="algo"
                                                        width={20}
                                                        height={20}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </CardBody>
                </Card>
            </Tab>
        );}}
        </Tabs>
    );
}
