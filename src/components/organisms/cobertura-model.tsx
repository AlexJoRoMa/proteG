import Image from "next/image";
import { CoberturaID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/CoberturaTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";


const CoberturaModel = async ({id} : CoberturaID) =>{
    const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "coberturaModel",
        'sys.id': id,
        select: ['fields.cardsContent'],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    })

  const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;
  
 return(
        <div className=" bg-[image:var(--gradient-background)] w-full  lg:h-[455px] md:h-[455px] xsm:h-[464px]">
            <div className="md:mx-md 2xl:mx-xl">
            {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
                const { entryTitle, entryBody, textBoton1, linkBoton1, image }= card.fields as StepTabEntryFields;
                
                const assetImage = image?.fields?.image as Asset | undefined;
                const imgURL = assetImage?.fields?.file?.url;

                return(
                    <div key={card.sys.id} className=" flex flex flex-col items-center h-full">
                        <div className=" flex flex-col items-center h-full ">
                        <div className=" lg:mt-12 md:mt-8 xsm:mt-8">
                        {imgURL && (
                            <Image 
                             className=" lg:w-[88px] md:w-[88px] xsm:w-[56px] lg:h-[88px] md:h-[88px] xsm:h-[56px]" 
                            alt={'Images'}
                            src={`https:${imgURL}`}
                            priority
                            width={424}
                            height={88}
                            />
                            )}
                        </div>

                        <div className=" lg:text-[36px] md:text-[36px] xsm:text-[28px] font-bold lg:mt-8 md:mt-6 xsm:mt-5 xsm:px-2 md:px-0 text-center">
                            <h1>{entryTitle}</h1>
                        </div>
                        <div className=" w-full xsm:px-4 lg:mt-6 md:mt-3 xsm:mt-6 lg:h-25 md:h-25 xsm:h-35 lg:text-[18px] md:text-[18px] xsm:text-[16px] text-center flex items-center justify-center">
                            <p>{entryBody}</p>
                        </div>

                        <div className="lg:mt-2 md:mt-1 xsm:mt-1">
                            <ButtonGhost classStyles="border-black text-black text-[16px] leading-6 font-bold hover:!bg-white hover:!text-black w-full h-[48px] rounded-md
                            lg:w-[320px] md:w-[320px] xsm:w-[256px]"
                            text={textBoton1 as string} href={linkBoton1 as string}
                            />
                        </div>
                        
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    );
}

export default CoberturaModel