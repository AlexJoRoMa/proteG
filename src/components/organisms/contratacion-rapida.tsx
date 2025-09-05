import Image from "next/image";
import { ContratacionRapidaID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/CardsTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from "@contentful/rich-text-types";


const ContratacionRapida = async ({id} : ContratacionRapidaID) =>{

  const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
      content_type: "cardsContentModel",
      'sys.id': id,
      select: ['fields.cardsContent', 'fields.tituloTexto', 'fields.title', 'fields.typeGradient', 'fields.titlePosition'],
      include: 2,
    }).then((entriesResponse) => {
      return entriesResponse.items
    });

  const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;
  const getTitlePosition: boolean | undefined = callCardsContent?.[0]?.fields.titlePosition as unknown as boolean | undefined;
  const getTitle: string | undefined = callCardsContent?.[0]?.fields.title as unknown as string | undefined;
  const tipoGradiante: string | undefined = callCardsContent?.[0]?.fields.typeGradient as unknown as string | undefined;
  const tituloTexto: Document | undefined = callCardsContent?.[0]?.fields.tituloTexto as unknown as Document | undefined;

/* Fija el tipo de color del gradiante y el tamaño, se recibe desde contentful  */
  const setHorizontalColor = tipoGradiante == 'naranja/verde/rosa/amarillo' ? 'bg-[image:var(--gradient-bar-horizontal-4-naranverderosaamarillo)]' 
   : tipoGradiante == 'verde' ? 'bg-[image:var(--gradient-bar-horizontal-5-verde)]' 
   : tipoGradiante == 'amarillo' ? 'bg-[image:var(--gradient-bar-horizontal-5-amarillo)]' : 'bg-[image:var(--gradient-bar-horizontal-5-magenta)]';
   
  const setVerticalColor = tipoGradiante == 'naranja/verde/rosa/amarillo' ? 'bg-[image:var(--gradient-bar-vertical-4-naranverderosaamarillo)]' 
   : tipoGradiante == 'verde' ? 'bg-[image:var(--gradient-bar-vertical-5-verde)]' 
   : tipoGradiante == 'amarillo' ? 'bg-[image:var(--gradient-bar-vertical-5-amarillo)]' : 'bg-[image:var(--gradient-bar-vertical-5-magenta)]';

   const setHorizontalWidth = getCardsContent.length === 5 ? '4xl:mx-23 xl:mx-[8.5%] lg:mx-[8%] md:mx-[8%]' : 'xl:mx-23 lg:mx-22 md:mx-15';
                                                                                                                  
  const setHorizontalBar = `${setHorizontalColor} ${setHorizontalWidth} top-[82px] left-0 right-0 h-[1px] z-0 hidden md:block absolute`;
  const setVerticalBar = `${setVerticalColor} top-8 bottom-8 block left-[24.3%]  w-[1px] z-0 md:hidden absolute`;
  
  const setMarginTop = getTitlePosition === true && getTitle !== undefined  ? 'md:mt-3 xsm:mt-7 md:mb-15' : 'md:mt-0 xsm:mt-5 md:mb-0';

  
  console.log('>>>>setMarginTop ', setMarginTop)

  return (
      <div className=" md:mx-md 2xl:mx-xl bg-white items-center justify-items-center box-content lg:h-[auto] md:h-[449px] xsm:h-[640px]  relative">
  
        <div className=" md:mt-15 xsm:mt-12 text-center lg:text-[36px] md:text-[25px] xsm:text-[32px]">
          {tituloTexto && documentToReactComponents(tituloTexto)}
        </div>

        <div>
          {getTitlePosition === true && (
            <p className=" mt-5 md:text-[18px] xsm:text-[16px]">{getTitle}</p>
          )}
        </div>
  
        <div className={` ${setMarginTop} md:w-full xsm:w-[373px] md:h-auto xsm:h-[420px] 
        relative flex md:flex-row xsm:flex-col justify-between md:items-start xsm:items-center md:gap-x-8 xsm:gap-x-0 `}>
          
          <div className={setHorizontalBar} />
          <div className={setVerticalBar} />
           
  
          {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
            const { entryTitle, richText, image, dot } = card.fields as StepTabEntryFields;

            const assetImage = image?.fields?.image as Asset | undefined;
            const imgURL = assetImage?.fields?.file?.url;
            const dotURL = (dot as unknown as Asset)?.fields?.file?.url;

            return (
              <div key={card.sys.id} className=" 
              relative  flex md:flex-col xsm:flex-row items-center xsm:justify-center
               xl:w-[192px] lg:w-[184px] md:w-[128px] xsm:w-[355px] ">
                
                <div className=" items-center flex md:flex-col xsm:flex-row flex-shrink-0">
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

                <div className=" md:mt-6 xsm:mt-0 md:ml-0 xsm:ml-6 md:pr-0 xsm:pr-1 md:text-center xsm:text-left flex flex-col md:justify-center xsm:justify-start align-middle items-center  ">
                {entryTitle && (
                  <p className=" w-full font-bold md:text-[18px] xsm:text-[16px] ">
                    {entryTitle}
                  </p>
                )}
                  <div className=" md:text-[16px] xsm:text-[14px] ">
                    {richText && documentToReactComponents(richText)}
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>

        <div>
          {getTitlePosition === false && (
            <p className=" mt-10 mb-10 md:text-[18px] xsm:text-[16px]">{getTitle}</p>
          )}
        </div>

      </div>
    );
}

export default ContratacionRapida