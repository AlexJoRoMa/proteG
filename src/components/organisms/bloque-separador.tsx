import Image from "next/image";
import { BloqueSeparadorID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/BloqueSeparador';
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";

const BloqueSeparador = async ({id}: BloqueSeparadorID) => {
    
    const callModelContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "izziTvModeloSeparador",
        'sys.id': id,
        select: ['fields.cardsContent'],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });
    
    
    const getModelContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callModelContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;

    console.log('>>>> getModelContent ', getModelContent)

    return(
        <div className=" bg-gray-450 relative md:h-[181px] xsm:h-[273px]">
        <div className=" md:mx-md 2xl:mx-xl h-full content-center ">

           {getModelContent && getModelContent.map((card: Entry<StepTabEntrySkeleton>) => {
            const { textoTitulo, bodyText, isModal, textBoton1, urlBtn1, image } = card.fields as StepTabEntryFields;
            
            const assetImage = image?.fields?.image as Asset | undefined;
            const imgURL = assetImage?.fields?.file?.url;

            return(
                <div key={card.sys.id} className=" flex md:flex-row xsm:flex-col text-white relative justify-between md:gap-4 xsm:gap-8 items-center">
                    
                {/* logica de texto e imagen, solo uno puede existir, de momento 
                se harcodea el mensaje de error por que contentful no tiene 
                logica condicional para sus campos, por eso se hace de este lado */}

                {imgURL && !textoTitulo && (
                    <div className=" relative  ">
                        {imgURL && (
                            <Image
                            className="md:w-[283px] md:h-[52px] xsm:w-[187px] xsm:h-[35px]"
                            alt={'Images'}
                            src={`https:${imgURL}`}
                            loading="lazy"
                            width={283}
                            height={52}
                            />
                            )}
                    </div>
                )}
                
                {textoTitulo && !imgURL && (
                    <div className=" 3xl:w-[283px] 2xl:w-[300px] xl:w-[230px] lg:w-[30%] md:w-[350px] relative
                    4xl:text-[36px]  xl:text-[27px] md:text-[20px] xsm:text-[36px] text-left">
                        {textoTitulo && documentToReactComponents(textoTitulo)}
                    </div>
                )}

                {imgURL && textoTitulo && (
                    <h1>Solo el campo de texto titulo o image puede estar a la vez. Elija solo una</h1>
                )}

                {!imgURL && !textoTitulo && (
                    <h1>Debe de llenar el campo texto titulo o image. Elija alguno</h1>
                )}
                    


                {/* Aqui va el texto del centro */}
                
                <div className=" md:mx-[0%] xsm:mx-[5%] md:text-center xsm:text-left md:text-[18px] xsm:text-[16px] md:text-gray-200 xsm:text-white">
                    <p>{bodyText}</p>
                </div>
                
                {/* Aqui va el boton */}
                <div className="">
                    <ButtonGhost classStyles="border-white text-white text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black w-full rounded-md
                    h-[48px]
                    3xl:w-[320px] xl:w-[250px] md:w-[170px] xsm:w-[320px] "
                    text={textBoton1 as string} href={urlBtn1 as string}
                    />
                </div>

                </div>
            );
           })}
        </div>
        </div>
    )

}

export default BloqueSeparador