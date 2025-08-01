import Image from "next/image";
import { TVBeneficiosProductosID, configuradoCopyFields, StepTabEntrySkeleton, StepTabEntryFields } from '@/types/TVBeneficiosProductosTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";
import { getCopyForComponent } from '../../services/contentful/components';

const TVBeneficiosProductos = async ({id} : TVBeneficiosProductosID) => {
    const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "izziTvModelBeneficios",
        'sys.id': id,
        select: ['fields.cardsContent'],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    })
    
    const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;
    
    
    const getTitle = await getCopyForComponent('TVBeneficios-Producto');
    const setTitle = getTitle.tvbenprod as unknown as configuradoCopyFields;
    
    
    return(
    <div className=" bg-gray-50 lg:h-[700px] md:h-[700px] xsm:h-[610px]">
    <div className="  flex flex-col md:mx-md 2xl:mx-xl items-center justify-center   ">
        
        {/* titulo */}
        <div className="  md:mt-20 xsm:mt-10 md:w-full xsm:w-[95%] flex justify-center items-center">
            <h1 className="font-bold md:text-[36px] xsm:text-[30px] text-center">{setTitle.titulo}</h1>
        </div>
    

        {/* Body */}
        <div className="  md:w-full xsm:w-[90%] lg:mt-5 md:mt-0 xsm:mt-7 
        flex flex-row 2xl:gap-6 md:gap-4 xsm:gap-4 justify-start items-center 
        overflow-x-auto custom-scrollbar">
            
            {/* componentes cards */}
            {getCardsContent && getCardsContent.map((card: Entry<StepTabEntrySkeleton>) => {
                const { titulo, botonText, esModal, linkBoton, imagen } = card.fields as StepTabEntryFields;
                
                const assetImage = imagen?.fields?.image as Asset | undefined;
                const imgURL = assetImage?.fields?.file?.url;

                return(
                    <div key={card.sys.id} className="border-[1px] border-[#00C1B5] 
                    2xl:h-[490px] xl:h-[460px] lg:h-[450px] md:h-[430px] xsm:h-[400px]
                    w-full max-w-[390px] min-w-[260px] 
                    bg-white flex flex-row items-center justify-center rounded-lg
                    md:mt-8 xsm:mt-0 
                    ">
                        <div className=" flex flex-col items-center h-full w-full ">
                        
                        <div className=" lg:mt-10 md:mt-5 xsm:mt-8 ">
                            <h1 className="font-bold md:text-[24px] xsm:text-[24px]">{titulo}</h1>
                        </div>
                        <div className=" lg:mt-4 md:mt-4 xsm:mt-4
                        lg:w-auto lg:h-[auto]
                        xsm:w-[248px] xsm:h-[225px]  ">
                            {imgURL && (
                                <Image
                                className=" px-4 "
                                alt={'Images'}
                                src={`https:${imgURL}`}
                                loading="lazy"
                                width={336}
                                height={336}
                                />
                            )}
                        </div>
                        <div className="2xl:mt-3 xl:mt-8 lg:mt-8 md:mt-8 xsm:mt-4 w-full flex items-center justify-center ">
                            <ButtonGhost classStyles="border-black text-black md:text-[18px] xsm:text-[16px] leading-6 font-bold hover:!bg-white hover:!text-black w-full h-[48px] rounded-md
                            w-[90%] w-max-[336px] w-min-[248px]"
                            text={botonText as string} href={linkBoton as string}
                            />
                        </div>
                        </div>
                    </div>
                );
            })}
        </div>

    </div>
    </div>
    );
}

export default TVBeneficiosProductos
