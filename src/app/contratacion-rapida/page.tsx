import Image from "next/image";
import { getCards } from '../../services/contentful/cards'

export default async function ContratacionRapida(){
    const ids = [
    '4FL3WMn8tLkutYJ8uhcp9n',
    '7eranUDkB4XJknzt6VTtXo',
    'b9CN2z8VbmjiV4zWL8zZH',
    '3ri4J3b2bIG0SwjW2kafcN'
  ]; //ids de las cards

  const cards = await getCards(ids);

  return (
      <div className="border border-red-500 items-center justify-items-center
      box-content box-border 
      lg:w-280 md:w-200 sm:w-[402px] 
      lg:h-80 md:h-70 sm:h-[622px]">
         
        <h1 className="font-bold md:text-[25px] lg:mb-3 lg:mt-3 md:mb-1">hazlo fácil, hazlo izzi</h1>
  
        <div className="border border-green-500 md:flex md:flex-row sm:flex-col">
          {cards.map((card: any) => {
            const bodyText = card.fields;
            const imgURL = bodyText?.image?.fields?.image?.fields?.file?.url;
            const dotURL =  card.fields?.dot?.fields?.file?.url;
  
            return (  // border border-red-500   
              <div key={card.sys.id} className="border border-blue-500 box-border md:w-40 md:h-50 md:p-1 md:mx-3">
                <div className="md:items-center md:justify-items-center sm:items-baseline sm:justify-items-start">
                    <div className="border border-yellow-500 box-border w-20 h-20 
                    flex items-center justify-center ">
                        {imgURL && (
                            <Image
                            alt={'Images'}
                            src={`https:${imgURL}`}
                            width={40}
                            height={40}
                            /> 
                        )}
                    </div>
                    <div className="border border-yellow-500 md:mt-1 md:mb-6">
                        {dotURL && (
                            <Image
                            alt={'Images'}
                            src={`https:${dotURL}`}
                            width={8}
                            height={8}
                            />
                        )}
                    </div>
                </div>
                <div className="text-[12px] text-center  align-middle flex items-center justify-center ">
                  <p>{bodyText.entryBody}</p>      
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

}


/* 
<h1 className="font-bold lg:text-[36px] md:text-[25px] md:mb-1">hazlo fácil, hazlo izzi</h1>
<div className="border border-red-500 items-center justify-items-center box-content box-border lg:w-280 md:w-200 sm:w-40 lg:h-100 md:h-70"> 
<div className="lg:text-[18px] md:text-[12px] text-center  align-middle flex items-center justify-center ">
*/
