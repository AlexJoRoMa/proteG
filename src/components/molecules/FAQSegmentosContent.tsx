'use client'

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TabsDataFields, TabsContentProps } from "@/types/FAQTypes";
import { EntrySkeletonType } from "contentful";
import FAQAccordion  from '../molecules/FAQAccordionContent';

export default function TabFAQ({ tabsData }: TabsContentProps) {

    const cardsInfo = tabsData as unknown as EntrySkeletonType<TabsDataFields>[];

    const checkTab = cardsInfo?.[0]?.fields.entryTitle ? true : false;

    const defaultKey = cardsInfo?.[0]?.fields.entryTitle;
    const accordionData = cardsInfo.flatMap((entry) => entry.fields.cards ?? []);

    return (
        <>
        {checkTab ? (
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
                            <FAQAccordion cards={item.fields.cards} />
                        </CardBody>
                    </Card>
                </Tab>
            )}
        </Tabs>
        ) : (
            <FAQAccordion cards={accordionData} />
        )}
        
        </>
    )
}