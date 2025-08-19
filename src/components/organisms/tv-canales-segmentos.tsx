import Image from "next/image";
import { TVCanalesSegmentoID, TVCanalesSkeleton, TVCanalesSegmentoSkeleton, CanalesContenedorFields } from '@/types/TvCanalesSegmentosTypes';
import { tabsTileProps, TabsDataFields } from "@/types/TabsTypes";
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";

const TVCanalesSegmento = async ({id} : TVCanalesSegmentoID) =>{
    
    const tabsEntry:Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'tabsContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });
    
    const entryTitle = tabsEntry?.fields.title as string;
    const entryData = tabsEntry?.fields.tabs as unknown as EntrySkeletonType<TabsDataFields>;

    
    console.log('>>>>>> entryData', entryData);
/* 
py-[40] font-bold text-2xl lg:text-3xl text-wrap text-center px-[24px]

 */    
    return(
    <div className="bg-white">
        <div className="md:mx-md 2xl:mx-xl mt-15 flex justify-between">
            <ButtonGhost classStyles="border-black text-black text-[18px] leading-6 font-bold hover:!bg-black hover:!text-white 
            w-full rounded-md h-[48px] w-[144px]"
            text="Text_Test" href="/"
            />
            <ButtonGhost classStyles="border-black text-white bg-black text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
            w-full rounded-md h-[48px] w-[205px] "
            text="Text_Test" href="/"
            />
        </div>
        
        
        
        <div className="flex flex-col w-full mt-10 self-center items-center">
            <h1 className="text-[36px] font-bold">{entryTitle}</h1>
        </div>
    </div>
    );
}

export default TVCanalesSegmento;




   