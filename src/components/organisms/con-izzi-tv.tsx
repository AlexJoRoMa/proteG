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
    <div className="border md:border-yellow-500 sm:border-red-500 xsm:border-green-500 bg-black flex md:w-full xsm:w-full md:h-[518px] xsm:h-[765px]">
        {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
        const { titulo, tituloResaltado, body, desde, precio, textTiempo, incluye,  textBoton1, linkBoton1, adicionales ,imagen }= card.fields as StepTabEntryFields;
         
        const assetImage = imagen?.fields?.image as Asset | undefined;
        const imgURL = assetImage?.fields?.file?.url;

        return(
            <div key={card.sys.id} className="border border-purple-500 bg-cover w-full" style={{ backgroundImage: `url(${imgURL})`}}>
                <div className="border border-red-500 md:w-[400px] xsm:w-[90%] md:h-[85%] xsm:h-[350px] md:mt-15 md:ml-50 xsm:ml-4 xsm:mt-4">
                    <div  className=" text-white md:text-[64px] xsm:text-[56px]">
                        <h1>
                            <span>{titulo} </span>
                            <span className="font-bold">{tituloResaltado}</span>
                        </h1>
                    </div>
                    <div  className=" text-white md:text-[32px] xsm:text-[24px] w-[80%]">
                        <h1>{body}</h1>
                    </div>
                    <div  className="text-white">
                        <p>
                            <span className="md:text-[16px] xsm:text-[14px]">{desde}</span>
                            <span className="md:text-[56px] xsm:text-[48px] ml-4">{precio} </span>
                            <span className="md:text-[16px] xsm:text-[14px]">{textTiempo}</span></p>
                    </div>
                    <div  className=" flex w-full text-white text-[16px] mt-1">
                        <p className="whitespace-nonwrap">{incluye}</p>
                        {adicionales && (
                            <div className=" flex flex-wrap items-start ml-4 mt-[7px] gap-x-2 gap-y-2">
                                { adicionales?.map((assets: Asset) => {
                            const url = assets.fields?.file?.url;
                            // border border-blue-200 border border-green-400 border border-red-500
                             
                            return (
                                <div key={assets.sys.id} className="  ">
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

                    <div>
                        <ButtonGhost classStyles="border-white text-black text-[16px] leading-6 font-bold bg-white hover:!bg-white hover:!text-black w-full rounded-md
                        mt-5
                         h-[48px]
                         w-[320px] "
                        text={textBoton1 as string} href={linkBoton1 as string}
                        />
                    </div>

                    {/* imagen responsiva para pantalla movil */}
                    <div className="border border-blue-200 mt-5">
                        {imgURL && (
                            <Image
                            alt={'Images'}
                            src={`https:${imgURL}`}
                            width={370}
                            height={280}
                            />
                        )}
                    </div>
                </div>
                
            </div>
        );
      })}
        
    </div>
    );
 }


export default ConIzziTv
