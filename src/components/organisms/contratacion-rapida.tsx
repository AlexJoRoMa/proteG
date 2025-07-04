/* eslint-disable @typescript-eslint/no-explicit-any */
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
      <div className=" items-center justify-items-center box-content box-border lg:w-280 md:w-200 xsm:w-[320px] lg:h-80 md:h-80 xsm:h-[550px]">
         
        <h1 className="font-bold md:text-[25px] xsm:text-[25px] lg:mb-3 lg:mt-3 md:mb-1 xsm:mt-7">hazlo fácil, hazlo izzi</h1>
  
        <div className=" relative  md:flex md:flex-row sm:flex-col ">
           
           {/* barra radiante_> top-[px] left-[] maneja la posicion...md:mx-[] top-[] bottom-[] manejan el ancho/altura de la barra*/}
           <div className="hidden md:block absolute top-[119px] left-0 right-0 h-[1px] z-0 md:mx-22 gradient-bar-horizontal " />
           <div className="block md:hidden absolute left-[89px] top-10 bottom-10 w-[1px] z-0 gradient-bar-vertical " />

          {cards.map((card: any) => {
            const bodyText = card.fields;
            const imgURL = bodyText?.image?.fields?.image?.fields?.file?.url;
            const dotURL =  card.fields?.dot?.fields?.file?.url;
  
            return (  // border border-red-500          py-2
              <div key={card.sys.id} className="relative z-10 box-border md:w-40 xsm:w-80 md:h-50 md:p-1 md:mx-3 flex md:flex-col sm:flex-row xsm:my-6">
                <div className="  items-center md:flex sm:flex xsm:flex md:flex-col sm:flex-row xsm:flex-row">
                    <div className=" box-border w-20 h-20 flex items-center justify-center">
                        {imgURL && (
                            <Image
                            className=" w-[72px] h-[72px] xsm:w-[56px] xsm:h-[56px]"
                            alt={'Images'}
                            src={`https:${imgURL}`}
                            priority={false}
                            loading="lazy"
                            width={40}
                            height={40}
                            /> 
                        )}
                    </div>
                    <div className="md:mt-1 md:mb-6 md:ml-0 xsm:ml-4">
                        {dotURL && (
                            <Image
                            alt={'Images'}
                            src={`https:${dotURL}`}
                            priority={false}
                            loading="lazy"
                            width={16}
                            height={16}
                            />
                        )}
                    </div>
                </div>
                <div className="text-[12px] md:text-center xsm:text-left align-middle flex items-center justify-center 
                md:pl-0 xsm:pl-7">
                  <p>{bodyText.entryBody}</p>      
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

}



