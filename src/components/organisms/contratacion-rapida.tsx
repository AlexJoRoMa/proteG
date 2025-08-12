import Image from "next/image";
import { ContratacionRapidaID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/CardsTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";


const ContratacionRapida = async ({id} : ContratacionRapidaID) =>{

  const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
      content_type: "cardsContentModel",
      'sys.id': id,
      select: ['fields.cardsContent', 'fields.title', 'fields.typeGradient'],
      include: 2,
    }).then((entriesResponse) => {
      return entriesResponse.items
    });

  const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;
  const getTitle: string | undefined = callCardsContent?.[0]?.fields.title as unknown as string | undefined;
  const tipoGradiante: string | undefined = callCardsContent?.[0]?.fields.typeGradient as unknown as string | undefined;


  const setHorizontalColor = tipoGradiante == 'naranja/verde/rosa/amarillo' ? 'bg-[image:var(--gradient-bar-horizontal-4-naranverderosaamarillo)]' 
   : tipoGradiante == 'verde' ? 'bg-[image:var(--gradient-bar-horizontal-5-verde)]' 
   : tipoGradiante == 'amarillo' ? 'bg-[image:var(--gradient-bar-horizontal-5-amarillo)]' : 'bg-[image:var(--gradient-bar-horizontal-5-magenta)]';
   
  const setVerticalColor = tipoGradiante == 'naranja/verde/rosa/amarillo' ? 'bg-[image:var(--gradient-bar-vertical-4-naranverderosaamarillo)]' 
   : tipoGradiante == 'verde' ? 'bg-[image:var(--gradient-bar-vertical-5-verde)]' 
   : tipoGradiante == 'amarillo' ? 'bg-[image:var(--gradient-bar-vertical-5-amarillo)]' : 'bg-[image:var(--gradient-bar-vertical-5-magenta)]';


  const setHorizontalBar = `${setHorizontalColor} xl:mx-23 lg:mx-22 md:mx-15 top-[82px] left-0 right-0 h-[1px] z-0 hidden md:block absolute`;
  const setVerticalBar = `${setVerticalColor} top-8 bottom-8 block left-[24.3%]  w-[1px] z-0 md:hidden absolute`;
  
  
  return (
      <div className=" md:mx-md 2xl:mx-xl bg-white items-center justify-items-center box-content lg:h-auto md:h-[449px] xsm:h-[640px]  relative">
  
        <div className=" md:mt-15 xsm:mt-12 text-center">
          <h1 className=" font-bold md:text-[25px] xsm:text-[32px]">{getTitle}</h1>
        </div>
  
        <div className=" md:mt-10 md:mb-15 xsm:mt-7 md:w-full xsm:w-[373px] md:h-auto xsm:h-[420px] 
        relative flex md:flex-row xsm:flex-col justify-between md:items-start xsm:items-center md:gap-x-8 xsm:gap-x-0 ">
          
          <div className={setHorizontalBar} />
          <div className={setVerticalBar} />
           
  
          {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
            const { entryBody, image, dot } = card.fields as StepTabEntryFields;

            const assetImage = image?.fields?.image as Asset | undefined;
            const imgURL = assetImage?.fields?.file?.url;
            const dotURL = (dot as unknown as Asset)?.fields?.file?.url;

            return (
              <div key={card.sys.id} className=" 
              relative  flex md:flex-col xsm:flex-row items-center xsm:justify-center
               xl:w-[192px] lg:w-[184px] md:w-[128px] xsm:w-[355px] ">
                
                <div className=" items-center flex flex md:flex-col xsm:flex-row flex-shrink-0">
                  <div className=" flex items-center justify-center">
                    {imgURL && (
                      <Image
                        className=" w-[72px] h-[72px] xsm:w-[56px] xsm:h-[56px]"
                        alt={'Images'}
                        src={`https:${imgURL}`}
                        loading="lazy"
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                  <div className="md:mt-5 xsm:mt-0 md:ml-0 xsm:ml-5">
                    {dotURL && (
                      <Image
                        className=" w-[12px] h-[12px] "
                        alt={'Images'}
                        src={`https:${dotURL}`}
                        loading="lazy"
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                </div>

                <div className=" md:text-[16px] xsm:text-[14px] md:text-center xsm:text-left 
                  md:mt-6 xsm:mt-0 md:ml-0 xsm:ml-6 md:pr-0 xsm:pr-1  align-middle flex items-center justify-center ">
                  <p>{entryBody}</p>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default ContratacionRapida