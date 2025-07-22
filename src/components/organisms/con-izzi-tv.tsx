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
    <div className=" flex w-full h-[518px]">
        {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
        const { titulo, tituloResaltado, body, desde, precio, textTiempo, incluye,  textBoton1, adicionales ,imagen }= card.fields as StepTabEntryFields;
         
        const assetImage = imagen?.fields?.image as Asset | undefined;
        const imgURL = assetImage?.fields?.file?.url;

        return(
            <div key={card.sys.id} className=" bg-cover w-full" style={{ backgroundImage: `url(${imgURL})`}}>
                <div className="border border-blue-500 w-[400px] h-[360px] mt-15 ml-50">
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
                    <div  className="border border-green-100 text-white text-[16px]">
                        <p>{incluye}</p>
                        { adicionales?.map((item: Asset) => {
                            const url = item.fields?.file?.url;
                            
                            return (
                                <div key={item.sys.id} className="border border-red-300">
                                    <Image
                                    src={`https:${url}`}
                                    alt={'adicional'}
                                    width={100}
                                    height={48}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="">
                        <ButtonGhost classStyles="border-white text-black text-[16px] leading-6 font-bold bg-white hover:!bg-white hover:!text-black w-full rounded-md
                         h-[48px]
                         w-[320px] "
                        text={textBoton1 as string} 
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
