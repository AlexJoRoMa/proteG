"use client";

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import {
  TabsDataFields,
  CardSegmentoFields,
  TabsContentProps,
  MediaEntryFields,
} from "@/types/TvCanalesSegmentosTypes";
import Image from "next/image";
import { Entry, EntrySkeletonType } from "contentful";
import TvChannelsFilter from "../tvChannels/TvChannelsFilter";
import { useState } from "react";

const normalize = (s: string) => s.trim().toLowerCase();

export default function SegmentosCanales({
  tabsData,
  filterContent,
}: TabsContentProps) {
  const cardsInfo = tabsData as unknown as EntrySkeletonType<TabsDataFields>[];

  const defaultKey = cardsInfo[0]?.fields?.entryTitle;

  const [selectedTabKey, setSelectedTabKey] = useState<string | null>(
    (tabsData?.[0] as { fields?: { entryTitle?: string } })?.fields
      ?.entryTitle ?? null,
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const selectedFilter = Array.from(selectedKeys).filter(
    (k) => k !== "__all__",
  );

  const onTabChange = (key: string | null) =>
    setSelectedTabKey(key === null || key === undefined ? null : String(key));

  const selectedSet = new Set((selectedFilter ?? []).map(normalize));
  const tabKeyToSelect = (selectedTabKey ?? defaultKey) as string | undefined;

  return (
    <Tabs
      key={`tabs-${(selectedFilter ?? []).join(",")}`}
      aria-label="Dynamic tabs"
      items={cardsInfo}
      variant="underlined"
      radius="md"
      fullWidth={true}
      defaultSelectedKey={tabKeyToSelect}
      onSelectionChange={() => onTabChange(Math.random().toString())}
      classNames={{
        tabContent:
          " leading-[24px] text-base group-data-[selected=true]:font-medium group-data-[selected=true]:text-black group-data-[selected=true]:font-bold  text-black lg:py-[20px] px-auto lg:w-[246px] whitespace-normal font-medium !rounded-t-sm ",
        panel: "bg-white w-full p-0",
        tabList:
          " w-auto flex items-center pb-0 rounded-none overflow-y-hidden",
        cursor: "bg-black rounded-none rounded-t-sm",
        base: "m-auto flex items-center justify-around ",
        tab: "h-[56px] lg:h-[48px] w-[300px] lg:w-[400px] rounded-none",
      }}
    >
      {(item) => {
        const cards = item.fields?.cards ?? [];
        const cardsToShow =
          selectedSet.size > 0
            ? cards.filter((card) => {
                const raw = card as {
                  fields?: CardSegmentoFields;
                } & CardSegmentoFields;
                const fields = raw.fields ?? raw;
                const titulo =
                  typeof fields?.titulo === "string"
                    ? fields.titulo
                    : undefined;
                return titulo ? selectedSet.has(normalize(titulo)) : false;
              })
            : cards;
        return (
          <Tab key={item.fields.entryTitle} title={item.fields.entryTitle}>
            <Card className="rounded-none  shadow-none md:mx-md 2xl:mx-xl">
              <div className="flex flex-col gap-y-2 mt-6 z-50 relative">
                <TvChannelsFilter
                  options={filterContent}
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                />
              </div>
              <CardBody
                key={`${item.fields.entryTitle}-${(selectedFilter ?? []).join(",")}`}
              >
                {cardsToShow.map((card) => {
                  const cardItem = card as unknown as Entry<
                    EntrySkeletonType<MediaEntryFields>
                  >;
                  const cardData =
                    (card as { fields?: CardSegmentoFields }).fields ??
                    (card as CardSegmentoFields);

                  return (
                    <div key={cardItem.sys.id}>
                      <div className="border-gradient-verde">
                        <div className=" text-[18px] md:text-[20px] leading-[24px] font-bold mt-5 mb-5">
                          <p>{cardData.titulo}</p>
                        </div>

                        <div className="grid 3xl:grid-cols-10 xsm:grid-cols-4">
                          {cardData.segmentoCanal?.map((canalEntry) => {
                            const mediaEntry =
                              canalEntry.fields as MediaEntryFields;

                            const imgURL = mediaEntry.image.fields.file.url;
                            const imgWidth =
                              mediaEntry.image.fields.file.details.image.width;
                            const imgHeight =
                              mediaEntry.image.fields.file.details.image.height;

                            return (
                              <div
                                key={canalEntry.sys.id}
                                className="w-full h-[80px] md:h-[100px] flex items-center justify-center"
                              >
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
                  );
                })}
              </CardBody>
            </Card>
          </Tab>
        );
      }}
    </Tabs>
  );
}
