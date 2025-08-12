import Image from "next/image";
import { IzziGoBloqueID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/IzziGOTypes';
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";

const IzziGoBloque = async ({id}: IzziGoBloqueID) => {
    
    const callComponents:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "izziTvIzziGo",
        'sys.id': id,
        select: ['fields.image',
            'fields.textoTitulo',
            'fields.bodyText',
            'fields.esModal',
            'fields.textBoton1',
            'fields.textBoton2',
            'fields.linkBoton2',
            'fields.textoDescarga',
            'fields.image2',
            'fields.image3',
             ],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });
    
    if(!callComponents){
        return null;
    }
    
    const getComponentContent= callComponents[0] as unknown as Entry<StepTabEntrySkeleton>;

    const { textoTitulo, bodyText, esModal, textBoton1, textBoton2, linkBoton2, textoDescarga, image, image2, image3 } = getComponentContent.fields as StepTabEntryFields;
    
    const assetImage = image?.fields?.image as Asset | undefined;
    const imgURL = assetImage?.fields?.file?.url;

    const assetImageStore2 = image2?.fields?.image as Asset | undefined;
    const imageStore1 = assetImageStore2?.fields?.file?.url;
    
    const assetImageStore3 = image3?.fields?.image as Asset | undefined;
    const imageStore2 = assetImageStore3?.fields?.file?.url;

    return(
        <div className="ring ring-blue-500 bg-black relative  md:h-[466px] xsm:h-[768px]">
        <div className="ring ring-yellow-500 md:mx-md 2xl:mx-xl h-full content-center ">
            
            <div key={getComponentContent.sys.id} className=" flex md:flex-row xsm:flex-col relative justify-between items-center">
                {/* logica de imagen */}
                <div className="ring ring-red-500 md:w-1/2 relative">
                {imgURL && (
                    <Image
                    className=" object-contain"
                    alt={'Images'}
                    src={`https:${imgURL}`}
                    loading="lazy"
                    width={589}
                    height={466}
                    />
                )}
                </div>


                {/* Aqui va la logica del parrafo y botones  */}
                <div className="ring ring-green-500 md:w-1/2">
                <div className=" md:text-left xsm:text-center text-white md:text-[36px] xsm:text-[32px]">
                    {textoTitulo && documentToReactComponents(textoTitulo)}
                </div>
                <div className="md:mt-5 xsm:mt-0">
                    <p className=" md:text-left xsm:text-center text-gray-200 md:text-[18px] xsm:text-[16px]">
                        {bodyText}
                    </p>
                </div>
                <div className="">
                    {/* Boton de SABER MAS que siempre estara visible  */}
                    <div>
                    {esModal === "si" && (
                        <ButtonGhost classStyles="border-white text-white text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
                        w-full rounded-md h-[48px] w-[256px] "
                    text={textBoton1 as string}
                    />
                    )}
                    {/* Boton de DESCARGAR LA APP que solo sera visible en pantallas pequeñas  */}
                    <ButtonGhost classStyles="border-white text-black bg-white text-[18px] leading-6 font-bold hover:!bg-black hover:!text-white 
                    md:hidden    w-full rounded-md h-[48px] w-[256px]  "
                    text={textBoton2 as string} href={linkBoton2 as string}
                    />
                    </div>

                    {/* Logica del texto */}
                    <div className="">
                    <p className="text-white">{textoDescarga}</p>

                    {imageStore1 && (
                        <Image
                        className=" object-contain"
                        alt={'Images'}
                        src={`https:${imageStore1}`}
                        loading="lazy"
                        width={135}
                        height={40}
                        />
                    )}

                    {imageStore2 && (
                        <Image
                        className=" object-contain"
                        alt={'Images'}
                        src={`https:${imageStore2}`}
                        loading="lazy"
                        width={120}
                        height={40}
                        />
                    )}
                    </div>

                </div>


                </div>
            </div>
            
           
        </div>
        </div>
    )

}

export default IzziGoBloque