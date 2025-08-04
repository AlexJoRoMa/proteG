import Image from "next/image";
import { TodoEnUnoCompID, StepTabEntrySkeleton, StepTabEntryFields } from '@/types/ModelTodoUnoTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";


const TodoEnUnoComp = async ({id} : TodoEnUnoCompID) =>{

  const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
    content_type: "todoUnoModel",
    'sys.id': id,
    select: ['fields.cardsContent'],
    include: 2,
  }).then((entriesResponse) => {
    return entriesResponse.items
  })

  const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;
  
  return (
    <div className=" bg-black w-full w-full lg:h-[450px] md:h-[408px] xsm:h-[720px]">
      <div className=" h-full">

      {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
        const { entryTitle, entryBody, desactivarBoton, textBoton1, linkBoton1, image }= card.fields as StepTabEntryFields;
         
        const assetImage = image?.fields?.image as Asset | undefined;
        const imgURL = assetImage?.fields?.file?.url;

        return(
          <div key={card.sys.id} className=" flex flex-col lg:flex-row md:flex-row w-full h-full text-white">
            {/*  div del contenido izq  */}
            <div className=" flex flex-col justify-center w-full lg:w-1/2 md:w-1/2  order-last lg:order-none md:order-none">
            <div className=" md:mx-md 2xl:mx-xl md:w-[70%] xsm:w-full
            flex flex-col lg:items-start lg:text-left md:items-start md:text-left xsm:items-center xsm:text-center">
              
              <div className=" lg:text-[36px] md:text-[22px] xsm:text-[32px] font-semibold 
              lg:mb-4 md:mb-4 xsm:mb-2 xsm:mt-4 ">
              <h2>{entryTitle}</h2>
              </div>
              <div className=" lg:text-[18px] md:text-[14px] lg:mt-6 lg:mb-6 md:mt-6 md:mb-6 md:mx-0 xsm:mt-4 xsm:mb-6 xsm:mx-8">
              <p >{entryBody}</p>
              </div>
              
            </div>
            <div className="md:mx-md 2xl:mx-xl flex lg:justify-start md:justify-start xsm:justify-center">
                {desactivarBoton === false && (
                  <ButtonGhost classStyles="border-white text-white text-[16px] leading-6 font-bold hover:!bg-white hover:!text-black w-full h-[48px] rounded-md
                   md:max-w-[320px] xsm:w-[256px]"
                    text={textBoton1 as string} href={linkBoton1 as string}
                    />
                  )}
              </div>
            </div>

            {/*  div del contenido derecho  */}
            <div className="relative w-full lg:w-1/2 md:w-1/2 h-64 lg:h-auto xsm:h-1/2 md:h-auto order-first lg:order-none md:order-none overflow-hidden">
            {imgURL && (
              <Image
              alt={'Images'}
              src={`https:${imgURL}`}
              loading="lazy"
              fill
              sizes="auto"
              style={{ objectFit: 'cover'}}
              />
            )}
            </div>

          </div>
        );
      })}
      </div>
    </div>
  );
}

export default TodoEnUnoComp
