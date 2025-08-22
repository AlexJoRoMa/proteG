'use client'

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TabsContentProps, TabsDataFields, CardSegmentosFields, MediaEntryFields } from '@/types/TvCanalesSegmentosTypes';
import Image from "next/image";
import { Entry, EntrySkeletonType } from "contentful";

export default function SegmentosCanales({ tabsData }: TabsContentProps) {

    const cardsInfo = tabsData;
    const defaultKey = cardsInfo?.[0]?.sys.id;


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
                <Card className="rounded-none  shadow-none md:mx-md 2xl:mx-xl ">
                    <CardBody className="">
                        {Array.isArray(item.fields.cards) && item.fields.cards.map((card: Entry<EntrySkeletonType<CardSegmentosFields>>) => {
                            
                            const segmentoData = card?.fields as CardSegmentosFields; 

                            return(
                                <div key={card.sys.id} className="">
                                    <div className=" border-gradient-verde">
                                        {/* titulo del segmento */}
                                        <div className="text-[20px] leading-[24px] font-bold mt-5 mb-5">
                                            <p>{segmentoData.titulo}</p>
                                        </div>

                                        {/* Grid de iconos */}
                                        <div className=" grid 3xl:grid-cols-10 xsm:grid-cols-4">
                                            {segmentoData.segmentoCanal && segmentoData.segmentoCanal.map((canalEntry: Entry<EntrySkeletonType<MediaEntryFields>>) =>{
                                                
                                                const asset = canalEntry?.fields?.image;
                                                const imgURL = asset?.fields?.file?.url;
                                                const imgWidth = asset?.fields?.file?.details?.image?.width;
                                                const imgHeight = asset?.fields?.file?.details?.image?.height;

                                                return(
                                                    <div key={canalEntry.sys.id} className="ring ring-blue-500 w-full h-[80px] md:h-[100px] flex items-center justify-center">
                                                        <Image 
                                                        className={`ring ring-red-500
                                                            max-w-[70%] max-h-[70%] object-contain
                                                            `}
                                                        src={`https:${imgURL}`}
                                                        alt="algo"
                                                        width={imgWidth}
                                                        height={imgHeight}
                                                        loading="lazy"
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
