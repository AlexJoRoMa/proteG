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
  
  return (//bg-black
    <div className="lg:bg-black md:bg-amber-200 sm:bg-orange-200 w-full  lg:h-100 md:h-80 xsm:h-[550px]">

      {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
        const { entryTitle, entryBody, desactivarComponentes, image }= card.fields as StepTabEntryFields;
         
        const assetImage = image?.fields?.image as Asset | undefined;
        const imgURL = assetImage?.fields?.file?.url;

        return(
          <div key={card.sys.id} className=" flex flex-col lg:flex-row md:flex-row w-full h-full text-white">
            {/*  div del contenido izq  */}
            <div className=" flex flex-col justify-center w-full lg:w-1/2 md:w-1/2 order-last lg:order-none md:order-none">
            <div className=" ml-40 mr-10">
              <h2 className="text-[36px] font-semibold mb-4">{entryTitle}</h2>
              <p className="text-[18px] mt-6 mb-6">{entryBody}</p>
              <div>
                {desactivarComponentes === false && (
                  <ButtonGhost classStyles="border-white text-white text-[16px] mt-2 mb-1 leading-6 font-bold hover:!bg-white hover:!text-black sm:max-w-[320px] max-w-[256px] w-full h-[48px] rounded-md"
                    text="saber más"
                    />
                  )}
              </div>
            </div>
            </div>

            {/*  div del contenido derecho  */}
            <div className="relative w-full lg:w-1/2 md:w-1/2 h-64 lg:h-auto order-first lg:order-none md:order-none overflow-hidden">
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

/* 
border border-red-100
<div className="bg-black items-center justify-items-center box-content  w-auto  lg:h-100 md:h-80 xsm:h-[550px]">

className=" w-[72px] h-[72px] xsm:w-[56px] xsm:h-[56px]"
 */