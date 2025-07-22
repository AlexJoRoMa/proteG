import Image from "next/image";
import { AccesoConfiguradorID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/ModelAccesoConfigTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";



const AccesoConfigurador = async ({id}: AccesoConfiguradorID) => {

    const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "accesoConfiguradorModel",
        'sys.id': id,
        select: ['fields.cardsContent'],
        include: 2,
      }).then((entriesResponse) => {
        return entriesResponse.items
      })
    
    const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;

    
    return(
        <div className="bg-white w-full absolute lg:h-120 md:h-120 xsm:h-[502px]">

            
            {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
                const { entryTitle, entryBodyLongText, textBoton1, linkBoton1, image }= card.fields as StepTabEntryFields;
                
                const assetImage = image?.fields?.image as Asset | undefined;
                const imgURL = assetImage?.fields?.file?.url;

                return(
                    <div key={card.sys.id} className=" flex flex flex-col items-center h-full">
                        <div className=" flex flex-col items-center h-full w-[90%]">
                        <div className=" mt-10">
                        {imgURL && (
                            <Image 
                             className=" lg:w-[424px] md:w-[424px] xsm:w-[250px] lg:h-[88px] md:h-[88px] xsm:h-[60px]" 
                            alt={'Images'}
                            src={`https:${imgURL}`}
                            priority
                            width={424}
                            height={88}
                            />
                            )}
                        </div>

                        {/* barra radiante_> top-[px] maneja la posicion...md:mx-[] manejan el ancho de la barra*/}
                        <div className=" md:block absolute lg:top-[140px] md:top-[135px] xsm:top-[110px] left-0 right-0 h-[1px] z-0 lg:mx-[25%] md:mx-[17%] xsm:mx-[10%] gradient-bar-horizontal " />

                        <div className=" lg:text-[36px] md:text-[36px] xsm:text-[28px] font-bold lg:mt-10 md:mt-10 xsm:mt-8">
                            <h1>{entryTitle}</h1>
                        </div>
                        <div className=" w-[85%] lg:h-25 md:h-25 xsm:h-50 lg:text-[18px] md:text-[18px] xsn:text-[16px] text-center lg:mt-8 md:v xsm:mt-6">
                            <p>{entryBodyLongText}</p>
                        </div>

                        <div className="lg:mt-8 md:mt-8 md:mt-3">
                            <ButtonGhost classStyles="border-black text-white text-[16px] leading-6 font-bold bg-black hover:!bg-white hover:!text-black w-full h-[48px] rounded-md
                            lg:w-[320px] md:w-[320px] xsm:w-[320px]"
                            text={textBoton1 as string} href={linkBoton1 as string}
                            />
                        </div>
                        
                        </div>
                    </div>
                )
            })}
            

        </div>
    );
}

export default AccesoConfigurador