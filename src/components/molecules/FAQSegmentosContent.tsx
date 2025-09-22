'use client'

import { Tabs, Tab, Card, CardBody, Accordion, AccordionItem } from "@heroui/react";
import { TabsDataFields, TabsContentProps, CardSegmentoFields } from "@/types/FAQTypes";
import { Entry, EntrySkeletonType } from "contentful";

export default function TabFAQ({ tabsData }: TabsContentProps) {

    const cardsInfo = tabsData as unknown as EntrySkeletonType<TabsDataFields>[];

    const defaultKey = cardsInfo?.[0]?.fields.entryTitle;


    //console.log('>>>> cardsInfo', cardsInfo );

    return (
        <Tabs
            aria-label="Dynamic tabs"
            items={cardsInfo}
            variant="underlined"
            radius="md"
            fullWidth={true}
            defaultSelectedKey={defaultKey}
            classNames={{
                tabContent: " leading-[24px] text-base group-data-[selected=true]:font-medium group-data-[selected=true]:text-black group-data-[selected=true]:font-bold  text-black lg:py-[20px] px-auto lg:w-[246px] whitespace-normal font-medium !rounded-t-sm ",
                panel: "bg-white w-full p-0",
                tabList: " w-auto flex items-center pb-0 rounded-none overflow-y-hidden",
                cursor: "bg-black rounded-none rounded-t-sm",
                base: "m-auto flex items-center justify-around ",
                tab: "h-[56px]  lg:h-[48px] w-[300px] lg:w-[400px] rounded-none"
            }}
            >
            {(item) => (
                <Tab key={item.fields.entryTitle} title={item.fields.entryTitle}>
                    <Card className="rounded-none  shadow-none md:mx-md 2xl:mx-xl">
                        <CardBody >
                            {item.fields.cards.map((card) =>{
                                
                                const cardData = card?.fields as CardSegmentoFields;

                                return(
                                    <div key={card.sys.id}>
                                        <Accordion>
                                            <AccordionItem
                                            key={card.sys.id}
                                            aria-label={cardData.pregunta || "Pregunta" }
                                            title={cardData.pregunta || "Pregunta"}
                                            className="text-[20px] font-bold"
                                            >
                                                {cardData.respuesta}
                                            </AccordionItem>
                                        </Accordion>
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