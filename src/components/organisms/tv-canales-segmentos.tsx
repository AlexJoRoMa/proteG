import { contentfulClient } from "@/services/contentful/client";
import { tabsTileProps, TabsDataFields } from "@/types/TvCanalesSegmentosTypes";
import { Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";
import SegmentosCanales from '../molecules/TvSegmentosContent';

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
/* 
    console.log('entryData ', entryData) */

    return(
    <div className="bg-white mb-10">
        <div className=" md:mx-md 2xl:mx-xl xsm:mx-3 mt-15 flex justify-between">
            <ButtonGhost classStyles="border-black text-black text-[18px] leading-6 font-bold hover:!bg-black hover:!text-white 
            w-full rounded-md h-[48px] md:w-[144px] xsm:w-[120px]"
            text="Text_Test" href="/"
            />
            <ButtonGhost classStyles="border-black text-white bg-black text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
            w-full rounded-md h-[48px] md:w-[205px] xsm:w-[180px]"
            text="Text_Test" href="/"
            />
        </div>
        
        
        
        <div className=" flex flex-col w-full mt-10 self-center items-center">
            
            <h1 className=" lg:text-[36px] xsm:text-[32px] font-bold mb-10 text-center xsm:mx-5 lg:mx-0">{entryTitle}</h1>
            
            <SegmentosCanales tabsData={entryData} />
            
        </div>
    </div>
    );
}
