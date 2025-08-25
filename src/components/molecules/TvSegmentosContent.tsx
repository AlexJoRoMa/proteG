'use client'

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TabsDataFields, CardSegmentoFields, TabsContentProps, MediaEntryFields } from "@/types/TvCanalesSegmentosTypes";
import Image from "next/image";
import { Entry, EntrySkeletonType } from "contentful";

export default function SegmentosCanales({ tabsData }: TabsContentProps) {

    const cardsInfo = tabsData as unknown as EntrySkeletonType<TabsDataFields>[];

    const defaultKey = cardsInfo?.[0]?.fields.entryTitle;

    return (
        <Tabs
            aria-label="Dynamic tabs"
            items={cardsInfo}
            variant="light"
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
            {(item) => (
                <Tab key={item.fields.entryTitle} title={item.fields.entryTitle}>
                    <Card className="rounded-none  shadow-none md:mx-md 2xl:mx-xl">
                        <CardBody className="">
                            {item.fields.cards && item.fields.cards.map((card) => {
                            
                            const segmentoData = card?.fields as CardSegmentoFields;

                            
                            return(
                                <div key={card.sys.id} className="">
                                    <div className="border-gradient-verde">
                                        
                                        {/* titulo del segmento */}
                                        <div className="text-[20px] leading-[24px] font-bold mt-5 mb-5">
                                            <p>{segmentoData.titulo}</p>
                                        </div>

                                        {/* Grid de iconos */}
                                        <div className="grid 3xl:grid-cols-10 xsm:grid-cols-4">
                                            {segmentoData.segmentoCanal?.map((canalEntry) =>{
                                                
                                                const asset = canalEntry.fields.image;
                                                const imgURL = asset?.fields?.file.url;
                                                const imgWidth = asset?.fields?.file.details.image.width;
                                                const imgHeight = asset?.fields?.file.details.image.height;

                                                return(
                                                    <div key={canalEntry.sys.id} className="w-full h-[80px] md:h-[100px] flex items-center justify-center">
                                                        <Image
                                                        className="max-w-[70%] max-h-[70%] object-contain"
                                                        src={`https:${imgURL}`}
                                                        alt="Logo de canal"
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
                )
            }
        </Tabs>
    )
}