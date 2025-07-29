import Image from "next/image";
import { ContratacionRapidaID, configuradoCopyFields, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/CardsTypes';
import { getCopyForComponent } from '../../services/contentful/components';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";


const ContratacionRapida = async ({id} : ContratacionRapidaID) =>{

  const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
      content_type: "cardsContentModel",
      'sys.id': id,
      select: ['fields.cardsContent'],
      include: 2,
    }).then((entriesResponse) => {
      return entriesResponse.items
    });

  const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;

  const getTitle = await getCopyForComponent('contratacion-rapida');
  const setTitle = getTitle.contratacion as unknown as configuradoCopyFields;
  

  return (
      <div className=" md:mx-md 2xl:mx-xl bg-white items-center justify-items-center box-content lg:h-81 md:h-81 xsm:h-[550px] relative">
  
        <div className="  lg:mb-3 lg:pt-4 md:pt-5 md:mb-1 xsm:mt-7">
        <h1 className=" font-bold md:text-[25px] xsm:text-[25px]">{setTitle.titulo}</h1>
        </div>
  
        <div className=" relative w-full  justify-center md:flex md:flex-row sm:flex-col ">
  
          {/* barra radiante_> top-[px] left-[] maneja la posicion...md:mx-[] top-[] bottom-[] manejan el ancho/altura de la barra*/}
          <div className="bg-[image:var(--gradient-bar-horizontal)] hidden md:block absolute top-[118px] left-0 right-0 h-[1px] z-0 xl:mx-[12.5%] md:mx-[12.5%] " />
          <div className="bg-[image:var(--gradient-bar-vertical)] block md:hidden absolute left-[86px] top-10 bottom-10 w-[1px] z-0 " />
  
          {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
            const { entryBody, image, dot } = card.fields as StepTabEntryFields;

            const assetImage = image?.fields?.image as Asset | undefined;
            const imgURL = assetImage?.fields?.file?.url;
            const dotURL = (dot as unknown as Asset)?.fields?.file?.url;

            return (
              <div key={card.sys.id} className=" relative z-10 w-full xsm:w-[95%] 
              md:h-50 xsm:my-6 md:p-1 flex md:flex-col sm:flex-row items-center">
                
                <div className=" items-center md:flex xsm:flex md:flex-col xsm:flex-row shrink-0">
                  <div className=" w-20 h-20 flex items-center justify-center">
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
                  <div className=" md:mt-1 md:mb-6 ">
                    {dotURL && (
                      <Image
                        className=" md:w-[12px] md:h-[12px] xsm:w-[12px] xsm:h-[12px]"
                        alt={'Images'}
                        src={`https:${dotURL}`}
                        loading="lazy"
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                </div>
                <div className=" text-[12px] md:text-center xsm:text-left 
                  md:pl-0 xsm:pl-7  align-middle flex items-center justify-center ">
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