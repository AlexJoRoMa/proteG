import Image from "next/image";
import { ConIzziTvID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/ConIzziTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";


const ConIzziTv = async ({id} : ConIzziTvID) =>{

    const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
            content_type: "izziTvModel",
            'sys.id': id,
            select: ['fields.cardsContent'],
            include: 2,
        }).then((entriesResponse) => {
            return entriesResponse.items
        })
    
      const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;

      console.log('>>>>> getCardsContent ', getCardsContent);
    return(
    <div className="bg-black flex w-full h-[518px]">
        {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
        const { titulo, body, desde, precio, textTiempo, incluye,  textBoton1, imagen }= card.fields as StepTabEntryFields;
         
        const assetImage = imagen?.fields?.image as Asset | undefined;
        const imgURL = assetImage?.fields?.file?.url;

        return(
            <div key={card.sys.id} className="bg-cover w-full" style={{ backgroundImage: `url(${imgURL})`}}>
                
                <div className="border border-blue-500 w-[400px] h-[360px] mt-15 ml-40">
                    <div  className=" text-white text-[64px]">
                        <h1>{titulo}</h1>
                    </div>
                    <div  className=" text-white text-[32px] w-[80%]">
                        <h1>{body}</h1>
                    </div>
                    <div  className="text-white">
                        <p>
                            <span className="text-[16px]">{desde}</span>
                            <span className="text-[56px] ml-4">{precio} </span>
                            <span className="text-[16px]">{textTiempo}</span></p>
                    </div>
                    <div  className="text-white text-[16px]">
                        <p>{incluye}</p>
                    </div>
                </div>
                
            </div>
        );
      })}
        
    </div>
    );
 }


export default ConIzziTv

/* 
{imgURL && (
                    <Image 
                    className="bg-[] " 
                    alt={'Images'}
                    src={`https:${imgURL}`}
                    priority
                    width={424}
                    height={88}
                    />
                )}




 */