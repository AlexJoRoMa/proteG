import Image from "next/image";
import { AccesoConfiguradorID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/ModelAccesoConfigTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";
import '@/styles/acceso-configurador.css';


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
        <div className=" md:mx-md 2xl:mx-xl relative bg-white lg:h-120 md:h-120 xsm:h-[502px]">

            
            {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
                const { entryTitle, entryBodyLongText, textBoton1, linkBoton1, image }= card.fields as StepTabEntryFields;
                
                const assetImage = image?.fields?.image as Asset | undefined;
                const imgURL = assetImage?.fields?.file?.url;

                return(
                    <div key={card.sys.id} className=" flex flex flex-col items-center h-full">
                        <div className=" w-full flex flex-col items-center h-full ">
                        <div className=" mt-10  flex items-center relative">
                         {/* barra radiante_> top-[px] maneja la posicion...md:mx-[] manejan el ancho de la barra left-0 right-0 xl:mx-[0%] md:mx-[17%] xsm:mx-[10%]*/}
                        <div className=" block absolute lg:top-[100px]  md:top-[100px] xsm:top-[70px] 
                         h-[1px] z-0 xl:w-[500px] md:w-[500px] xsm:w-[320px] left-1/2 transform -translate-x-1/2 
                         bg-[image:var(--gradient-bar-horizontal)]" />
                        
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

                        <div className=" lg:text-[36px] md:text-[36px] xsm:text-[28px] font-bold lg:mt-10 md:mt-10 xsm:mt-8">
                            <h1>{entryTitle}</h1>
                        </div>
                        <div className=" md:px-0 xsm:px-5 text-center lg:h-25 md:h-25 xsm:h-50 lg:text-[18px] md:text-[18px] xsm:text-[16px] text-center md:mt-4 xsm:mt-6 w-full flex items-center justify-center">
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