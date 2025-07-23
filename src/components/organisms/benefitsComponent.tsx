'use server'

import { contentfulClient } from "@/services/contentful/client";
import { BenefitsContainerProps, CardDataFields } from "@/types/BenefitsTypes";
import { Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";
import BenefitsCardContent from "../molecules/benefitsCardContent";

export default async function BenefitsComponent({ id }: BenefitsContainerProps) {
    const benefitsEntry: Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'benefitsContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    const entryTitle = benefitsEntry?.fields.title as string;
    const entryCta = benefitsEntry?.fields.ctaText as string;
    const entryCtaUrl = benefitsEntry?.fields.ctaUrl as string;
    const entryData = benefitsEntry?.fields.cards as unknown as EntrySkeletonType<CardDataFields>;

    return (
        <div className="flex flex-col w-full self-center items-center bg-gray-50 text-black-0 gap-[40px] py-[64px]">
            <h1 className="font-bold text-[32px] lg:text-4xl text-wrap text-center leading-[48px]">{entryTitle}</h1>
            <BenefitsCardContent cards={entryData} />
            <ButtonGhost 
                text={entryCta} 
                href={entryCtaUrl}
                classStyles="bg-black-0 py-[14px] px-[16px] rounded-md w-[320px] h-auto text-white-0 border-none font-semibold leading-[24px] text-lg"
            />
        </div>
    )

}