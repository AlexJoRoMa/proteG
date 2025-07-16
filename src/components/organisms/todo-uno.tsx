import Image from "next/image";
import { TodoEnUnoCompID } from '@/types/ModelTodoUno';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";

interface MediaEntryFields {
  image?: Asset;
}

interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}

interface StepTabEntryFields extends EntrySkeletonType{
  image?: Entry<MediaEntrySkeleton>;
  entryTitle?: string;
  entryBody?: string;
  desactivarComponentes?: boolean;
}

interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}


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
  
  return (//bg-black              border border-red-500 
    <div className="bg-black w-full  lg:h-100 md:h-80 xsm:h-[620px]">

      {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
        const { entryTitle, entryBody, desactivarComponentes, image }= card.fields as StepTabEntryFields;
         
        const assetImage = image?.fields?.image as Asset | undefined;
        const imgURL = assetImage?.fields?.file?.url;

        return(
          <div key={card.sys.id} className=" flex flex-col lg:flex-row md:flex-row w-full h-full text-white">
            {/*  div del contenido izq  */}
            <div className=" flex flex-col justify-center w-full lg:w-1/2 md:w-1/2  order-last lg:order-none md:order-none">
            <div className=" lg:ml-35 lg:mr-10 md:ml-20 md:mr-10 flex flex-col lg:items-start lg:text-left md:items-start md:text-left xsm:items-center xsm:text-center">
              <div className=" lg:text-[36px] md:text-[22px] xsm:text-[32px] font-semibold 
              lg:mb-4 md:mb-4 xsm:mb-2 xsm:mt-4 ">
              <h2>{entryTitle}</h2>
              </div>
              <div className=" lg:text-[18px] md:text-[14px] lg:mt-6 lg:mb-6 md:mt-6 md:mb-6 xsm:mt-4 xsm:mb-4">
              <p >{entryBody}</p>
              </div>
              
            </div>
            <div className="flex lg:justify-start lg:ml-35 md:justify-start md:ml-20 xsm:justify-center">
                {desactivarComponentes === false && (
                  <ButtonGhost classStyles="border-white text-white text-[16px] leading-6 font-bold hover:!bg-white hover:!text-black w-full h-[48px] rounded-md
                  max-w-[256px] md:max-w-[260px] sm:max-w-[320px]"
                    text="saber más"
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
              priority
              fill
              style={{ objectFit: 'cover'}}
              />
            )}
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default TodoEnUnoComp
