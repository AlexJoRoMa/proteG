import Image from "next/image";
import { MediaBlockModelID } from '@/types/MediaBlockTypes';
import { contentfulClient } from "@/services/contentful/client";

import { Asset, Entry, EntrySkeletonType } from "contentful";


const MediaBlockModel = async ({id}: MediaBlockModelID) => {

    const callComponents:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "media",
        'sys.id': id,
        select: ['fields.image'],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });
    
    if(!callComponents){
        return null;
    }

    const entry = callComponents[0];
    const getAsset = entry.fields.image as Asset | undefined;
    const imgURL = getAsset?.fields.file?.url;

    return(
        <div className="bg-white-0 4xl:h-[878px] 3xl:h-[750px] lg:h-[600px] md:h-[464px] xsm:h-[343px] flex items-center justify-center">
            <div className=" md:mx-md 2xl:mx-xl content-center
            md:w-full md:h-[400px] 4xl:h-[750px] 3xl:h-[650px] xl:h-[500px] lg:h-[450px] xsm:w-[370px] xsm:h-[231px] xsm:mx-[16px] xsm:my-[56px] md:my-[64px]
            ">
                {imgURL && (
                    <div className=" relative w-full h-full">
                        <Image
                        className="object-cover"
                        alt={'Images'}
                        src={`https:${imgURL}`}
                        loading="lazy"
                        fill
                        />
                    </div>
                )}
            
            
            </div>
        </div>
    )
}

export default MediaBlockModel