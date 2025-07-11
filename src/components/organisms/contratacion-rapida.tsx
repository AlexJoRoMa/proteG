import Image from "next/image";
import { getTabbedCard } from '../../services/contentful/cards';
import { ContratacionRapidaID, TabbedCardEntry, TabbedCard, configuradoCopyFields } from '@/types/Cards';
import { getCopyForComponent } from '../../services/contentful/components';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";

const ContratacionRapida = async ({id} : ContratacionRapidaID) =>{


  

  const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
      content_type: "cardsContentModel",
      'sys.id': id,
      select: ['fields.cardsContent']
    }).then((entriesResponse) => {
      return entriesResponse.items
    })

  const getCardsFields =  callCardsContent?.[0]?.fields.cardsContent as Entry<EntrySkeletonType, undefined, string>;

    console.log('_____api call ', callCardsContent );
    console.log('_____getFieldsa ', getCardsFields );

  return (
    <h1> hello</h1>
  );


}

export default ContratacionRapida


/* 
  
  return (
      <div className=" items-center justify-items-center box-content lg:w-280 md:w-200 xsm:w-[320px] lg:h-80 md:h-80 xsm:h-[550px]">
         
        <h1 className="font-bold md:text-[25px] xsm:text-[25px] lg:mb-3 lg:mt-3 md:mb-1 xsm:mt-7">{getTitle.titulo}</h1>
  
        <div className=" relative  md:flex md:flex-row sm:flex-col ">
           
           
           <div className="hidden md:block absolute top-[118px] left-0 right-0 h-[1px] z-0 md:mx-22 gradient-bar-horizontal " />
           <div className="block md:hidden absolute left-[89px] top-10 bottom-10 w-[1px] z-0 gradient-bar-vertical " />

          {cards.map((card: TabbedCardEntry) => {
            const { entryBody, image, dot } = card.fields as TabbedCard;
            const imgURL = image?.fields?.image?.fields?.file?.url;
            const dotURL =  dot?.fields?.file?.url;
  
            return (
              <div key={card.sys.id} className="relative z-10 md:w-40 xsm:w-80 md:h-50 md:p-1 md:mx-3 flex md:flex-col sm:flex-row xsm:my-6">
                <div className="  items-center md:flex sm:flex xsm:flex md:flex-col sm:flex-row xsm:flex-row">
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
                            className=" md:w-[12px] md:h-[12px] "
                            alt={'Images'}
                            src={`https:${dotURL}`}
                            priority
                            width={16}
                            height={16}
                            />
                        )}
                    </div>
                </div>
                <div className="text-[12px] md:text-center xsm:text-left align-middle flex items-center justify-center 
                md:pl-0 xsm:pl-7">
                  <p>{entryBody}</p>      
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

*/



/* 
    const ids = [
    '4FL3WMn8tLkutYJ8uhcp9n',
    '7eranUDkB4XJknzt6VTtXo',
    'b9CN2z8VbmjiV4zWL8zZH',
    '3ri4J3b2bIG0SwjW2kafcN'
  ]; //ids de las cards


  const cards = await getTabbedCard(ids);

  const callResourceTitle = await getCopyForComponent('contratacion-rapida');
  const getTitle = callResourceTitle.contratacion as unknown as configuradoCopyFields; */