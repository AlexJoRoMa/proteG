import { contentfulClient } from "@/services/contentful/client";
import { tabsTileProps, TabsDataFields } from "@/types/TvCanalesSegmentosTypes";
import { Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";
import SegmentosCanales from '../molecules/TvSegmentosContent';
import { getAllCopy, getCopyForComponent, getMicroCopy } from '@/services/contentful/components';

export default async function TVCanalesSegmento({ id }: tabsTileProps) {
    
    const tabsEntry:Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'tabsContainer',
        'sys.id': id,
        include: 3,
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });
    
    const entryTitle = tabsEntry?.fields.title as string;
    const entryData = tabsEntry?.fields.tabs as unknown as EntrySkeletonType<TabsDataFields>;

    const getTextVolver = await getMicroCopy('btn.volver');
    const getULRVolver = await getMicroCopy('btn.volverURL');
    const getTextGuia = await getMicroCopy('btn.guiaprogramacion');
    const getURLGuia = await getMicroCopy('btn.guiaURL');

    const setTextVolver = getTextVolver?.[0]?.fields?.value;
    const setURLVolver = getULRVolver?.[0]?.fields?.value;
    const setTextGuia = getTextGuia?.[0]?.fields?.value;
    const setURLGuia = getURLGuia?.[0]?.fields?.value;
    
    return(
    <div className="bg-white mb-10">
        <div className=" md:mx-md 2xl:mx-xl xsm:mx-3 mt-15 flex justify-between">
            <ButtonGhost classStyles="border-black text-black text-[16px] md:text-[18px] leading-6 font-bold hover:!bg-black hover:!text-white 
            w-full rounded-md h-[48px] md:w-[144px] xsm:w-[120px]"
            text={setTextVolver as string} href={setURLVolver as string}
            />
            <ButtonGhost classStyles="border-black text-white bg-black text-[16px] md:text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
            w-full rounded-md h-[48px] md:w-[205px] xsm:w-[180px]"
            text={setTextGuia as string} href={setURLGuia as string}
            />
        </div>
            
        <div className=" flex flex-col w-full mt-10 self-center items-center">
             <div className=" mb-10 xsm:mx-5 lg:mx-0">
            <h1 className=" 2xl:text-[36px] xl:text-[30px] xsm:text-[32px] font-bold  text-center ">{entryTitle}</h1>
            </div>
            <SegmentosCanales tabsData={entryData} />
            
        </div>
    </div>
    );
}
