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
    <div className="border border-green-500 flex w-full h-[518px]">
        {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
        const { titulo, tituloResaltado, body, desde, precio, textTiempo, incluye,  textBoton1, linkBoton1, adicionales ,imagen }= card.fields as StepTabEntryFields;
         
        const assetImage = imagen?.fields?.image as Asset | undefined;
        const imgURL = assetImage?.fields?.file?.url;

        return(
            <div key={card.sys.id} className=" bg-cover w-full" style={{ backgroundImage: `url(${imgURL})`}}>
                <div className=" w-[400px] h-[85%] mt-15 ml-50">
                    <div  className=" text-white text-[64px]">
                        <h1>
                            <span>{titulo} </span>
                            <span className="font-bold">{tituloResaltado}</span>
                        </h1>
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
                    <div  className=" flex w-full text-white text-[16px] mt-1">
                        <p className="whitespace-nonwrap">{incluye}</p>
                        {adicionales && (
                            <div className=" flex flex-wrap items-start ml-4 gap-x-2 gap-y-2">
                                { adicionales?.map((assets: Asset) => {
                            const url = assets.fields?.file?.url;
                            
                            return (
                                <div key={assets.sys.id} className="mt-1 ">
                                    <Image
                                    src={`https:${url}`}
                                    alt={'adicional'}
                                    priority
                                    width={100}
                                    height={24}
                                    />
                                </div>
                            );
                        })}
                            </div>
                        )}
                    </div>

                    <div className="">
                        <ButtonGhost classStyles="border-white text-black text-[16px] leading-6 font-bold bg-white hover:!bg-white hover:!text-black w-full rounded-md
                        mt-3
                         h-[48px]
                         w-[320px] "
                        text={textBoton1 as string} href={linkBoton1 as string}
                        />
                    </div>
                </div>
                
            </div>
        );
      })}
        
    </div>
    );
 }


export default ConIzziTv
