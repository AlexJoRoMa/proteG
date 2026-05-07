import { IframeModelID } from '@/types/IframeModelTypes';
import { contentfulClient } from "@/services/contentful/client";

import { Entry, EntrySkeletonType } from "contentful";


const IframeModel = async ({id}: IframeModelID) => {
    
    
    const callComponents:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "media",
        'sys.id': id,
        select: ['fields.iframeUrl'],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });
    
    if(!callComponents){
        return null;
    }

    const entry = callComponents[0];
    const getIframeURL = entry.fields.iframeUrl as string;

    
    return(
        <div className=' w-full 
        4xl:h-[820px] 
        2xl:h-[850px] xl:h-[870px]
        md:h-[1030px]
        sm:h-[1070px] xsm:h-[500px]
         '>
        <iframe sandbox="allow-forms allow-scripts allow-popups allow-top-navigation-by-user-activation allow-same-origin"
        src={getIframeURL}
        title='iframe'
        className='w-full h-full max-h-[1100px]'
        allow='geolocation'
        allowFullScreen
        />
        </div>
    )

}

export default IframeModel;