import Image from "next/image";
import { ContratacionRapidaID, configuradoCopyFields, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/Cards';
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
      <div className=" bg-white  items-center justify-items-center box-content w-full lg:h-81 md:h-81 xsm:h-[550px] relative">
  
        <div className="  lg:mb-3 lg:pt-4 md:pt-5 md:mb-1 xsm:mt-7">
        <h1 className=" font-bold md:text-[25px] xsm:text-[25px]">{setTitle.titulo}</h1>
        </div>
  
        <div className=" relative xl:w-[70%] lg:w-[90%] justify-center md:flex md:flex-row sm:flex-col ">
  
          {/* barra radiante_> top-[px] left-[] maneja la posicion...md:mx-[] top-[] bottom-[] manejan el ancho/altura de la barra*/}
          <div className=" hidden md:block absolute top-[118px] left-0 right-0 h-[1px] z-0 xl:mx-[12%] lg:mx-10 md:mx-22 gradient-bar-horizontal " />
          <div className="block md:hidden absolute left-[102px] top-10 bottom-10 w-[1px] z-0 gradient-bar-vertical " />
  
          {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
            const { entryBody, image, dot } = card.fields as StepTabEntryFields;

            const assetImage = image?.fields?.image as Asset | undefined;
            const imgURL = assetImage?.fields?.file?.url;
            const dotURL = (dot as unknown as Asset)?.fields?.file?.url;
  
            return (
              <div key={card.sys.id} className=" relative z-10 xl:w-55 md:w-40 xsm:w-80 md:h-50  lg:mx-6  md:mx-3 xsm:my-6 md:p-1 flex md:flex-col sm:flex-row ">
                <div className=" items-center md:flex xsm:flex md:flex-col xsm:flex-row flex-shrink-0">
                  <div className=" w-20 h-20 flex items-center justify-center">
                    {imgURL && (
                      <Image
                        className=" w-[72px] h-[72px] xsm:w-[56px] xsm:h-[56px]"
                        alt={'Images'}
                        src={`https:${imgURL}`}
                        priority
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                  <div className=" md:mt-1 md:mb-6 md:ml-0 xsm:ml-4">
                    {dotURL && (
                      <Image
                        className=" md:w-[12px] md:h-[12px] xsm:w-[12px] xsm:h-[12px]"
                        alt={'Images'}
                        src={`https:${dotURL}`}
                        priority
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                </div>
                <div className=" text-[12px] md:text-center xsm:text-left align-middle flex items-center justify-center
                  md:pl-0 xsm:pl-7">
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