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
                panel: " w-full p-0",
                tabList: " w-auto flex items-center pb-0 rounded-none overflow-y-hidden",
                cursor: "bg-black rounded-none rounded-t-sm",
                base: "m-auto flex items-center justify-around ",
                tab: "h-[56px]  lg:h-[48px] w-[300px] lg:w-[400px] rounded-none"
            }}
            >
            {(item) => (
                <Tab key={item.fields.entryTitle} title={item.fields.entryTitle}>
                    <Card className="rounded-none  shadow-none bg-transparent ">
                        <CardBody >
                            {item.fields.cards.map((card) =>{
                                
                                const cardData = card?.fields as CardSegmentoFields;
/*  light shadow bordered splitted                 */
                                return(
                                    <div key={card.sys.id}>
                                        <Accordion variant="light" className="border-b border-gray-150">
                                            <AccordionItem
                                            key={card.sys.id}
                                            aria-label={cardData.pregunta || "Pregunta" }
                                            title={
                                                <span className="md:text-[20px] xsm:text-[16px] font-bold">
                                                {cardData.pregunta || "Pregunta"}
                                                </span>}
                                            >
                                                <p className="md:text-[18px] xsm:text-[14 px] font-[400]">
                                                    {cardData.respuesta}
                                                </p>
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