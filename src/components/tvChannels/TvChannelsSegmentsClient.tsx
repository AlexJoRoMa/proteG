"use client";

import { useState } from "react";
import ButtonGhost from "../atoms/ButtonGhost";
import SegmentosCanales from "../molecules/TvSegmentosContent";
import TvChannelsFilter from "./TvChannelsFilter";
import { EntrySkeletonType } from "contentful";
import { TabsDataFields } from "@/types/TvCanalesSegmentosTypes";

type Props = {
  entryTitle: string;
  entryData: EntrySkeletonType<TabsDataFields>[] | null;
  filterOptions: string[];
  setTextVolver: string;
  setURLVolver: string;
  setTextGuia: string;
  setURLGuia: string;
};

export default function TvChannelsSegmentClient({
  entryTitle,
  entryData,
  filterOptions,
  setTextVolver,
  setURLVolver,
  setTextGuia,
  setURLGuia,
}: Props) {
  return (
    <div className="bg-white mb-10">
      <div className="md:mx-md 2xl:mx-xl xsm:mx-3 mt-15 flex justify-between">
        <ButtonGhost
          classStyles="border-black text-black text-[16px] md:text-[18px] leading-6 font-bold hover:!bg-black hover:!text-white
            w-full rounded-md h-[48px] md:w-[144px] xsm:w-[120px]"
          text={setTextVolver as string}
          href={setURLVolver as string}
        />
        <ButtonGhost
          classStyles="border-black text-white bg-black text-[16px] md:text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black
            w-full rounded-md h-[48px] md:w-[205px] xsm:w-[180px]"
          text={setTextGuia as string}
          href={setURLGuia as string}
        />
      </div>
      <div className="flex flex-col w-full mt-10 self-center items-center relative">
        <div className="mb-10 xsm:mx-5 lg:mx-0">
          <h1 className="2xl:text-[36px] xl:text-[30px] xsm:text-[32px] font-bold  text-center">
            {entryTitle}
          </h1>
        </div>
        <div className="z-0 relative">
          <SegmentosCanales
            tabsData={entryData}
            filterContent={filterOptions}
          />
        </div>
      </div>
    </div>
  );
}
