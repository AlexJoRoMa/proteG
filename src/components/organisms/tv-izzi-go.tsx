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
            'fields.sizeBlock',
            'fields.textOrder',
            'fields.textoTitulo',
            'fields.bodyText',
            'fields.button1Exist',
            'fields.esModal',
            'fields.textBoton1',
            'fields.linkBoton1',
            'fields.button2Exist',
            'fields.textBoton2',
            'fields.linkBoton2',
            'fields.assetsExist',
            'fields.textoDescarga',
            'fields.image2',
            'fields.image3',
            'fields.bgColor'
             ],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });
    
    if(!callComponents){
        return null;
    }
    
    const getComponentContent= callComponents[0] as unknown as Entry<StepTabEntrySkeleton>;

    const { textoTitulo,
        sizeBlock,
        textOrder,
        bodyText,
        button1Exist,
        esModal, 
        textBoton1,
        linkBoton1,
        button2Exist,
        textBoton2, 
        linkBoton2,
        assetsExist,
        textoDescarga, 
        image, 
        image2, 
        image3,
        bgColor } = getComponentContent.fields as StepTabEntryFields;
    
    const assetImage = image?.fields?.image as Asset | undefined;
    const imgURL = assetImage?.fields?.file?.url;

    const assetImageStore2 = image2?.fields?.image as Asset | undefined;
    const imageStore1 = assetImageStore2?.fields?.file?.url;
    
    const assetImageStore3 = image3?.fields?.image as Asset | undefined;
    const imageStore2 = assetImageStore3?.fields?.file?.url;

    const valueColor = bgColor?.value;
    const setColorContent = valueColor === '#000000' ? 'white' : 'black';

    const buttonWidth = assetsExist ? '3xl:w-[256px] lg:w-[200px] xsm:w-[256px]': 'md:w-[320px] xsm:w-[256px]';
    
    const getOrderTittle = textOrder ? 'order-first' : 'order-last';
    const getOrderBody = textOrder ? 'order-last' : 'order-first';
    const getTopMargin = textOrder ? 'lg:mt-0' : 'lg:mt-8 lg:mb-0 xsm:mb-5';

    const setParentSize = sizeBlock ? ' lg:h-[466px] md:h-full xsm:h-full justify-between' : 'lg:h-[347px] md:h-[600px] xsm:h-[600px] justify-between lg:gap-x-4 xsm:gap-x-0';
    const setImgMargin = sizeBlock ? 'lg:mt-0 xsm:mt-[24px] pt-0' : 'pt-8';
    


    return(
        <div className={` relative ${setParentSize} `}
        style={{backgroundColor: valueColor ? valueColor : '#000000'}}>
        <div className=" md:mx-md 2xl:mx-xl h-full content-center ">
            
            <div key={getComponentContent.sys.id} className={` ${setParentSize} lg:h-full flex lg:flex-row xsm:flex-col 
            relative items-center`}>
                
                {/* logica de imagen */}
                <div className={` ${setImgMargin} lg:w-1/2 lg:h-[99%] flex justify-center items-center `}>
                {imgURL && (
                    <div className=" lg:max-h-[580px]  xsm:max-w-[402px] xsm:max-h-[318px] xsm:min-w-[320px] xsm:min-h-[252px] xsm:mx-5">
                    <Image
                    className=" object-contain"
                    alt={'Images'}
                    src={`https:${imgURL}`}
                    loading="lazy"
                    width={589}
                    height={466}
                    />
                    </div>
                )}
                </div>


                {/* Llogica de textos y botones */}
                {/* Titulo y text body */}
                <div className=" lg:w-1/2 lg:h-[70%] pl-5 lg:mt-15 xsm:mt-0 mb-10 items-center">
                <div className=" flex flex-col">
                    <div className={` lg:text-left xsm:text-center ${getTopMargin} xsm:mt-8 ${getOrderTittle} text-${setColorContent} lg:text-[36px] xsm:text-[32px] md:mx-0 xsm:mx-5`}>
                        {textoTitulo && documentToReactComponents(textoTitulo)}
                    </div>
                    <div className={` lg:w-full lg: xsm:w-[90%] xsm:mx-auto lg:mt-5 xsm:mt-5 ${getOrderBody} `}>
                        <p className={` lg:text-left xsm:text-center text-${setColorContent} lg:text-[18px] xsm:text-[16px]`}>
                            {bodyText}
                        </p>
                    </div>
                </div>

                {/* Botones y las imagenes de store */}
                    <div className=" lg:mt-5 xsm:mt-0 flex flex-row lg:justify-between xsm:justify-center lg:gap-4 xsm:gap-0">
                       
                        {/* Boton 1 que siempre estara visible  */}
                        <div className=" flex lg:flex-row lg:items-end xsm:flex-col lg:mt-0 xsm:mt-10">
                        {button1Exist && (
                            <>{esModal === 'si' ? (
                                <ButtonGhost classStyles={`border-${setColorContent} text-white bg-black text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
                                w-full rounded-md h-[48px] ${buttonWidth}`}
                                text={textBoton1 as string}
                                />
                            ) : (
                                <ButtonGhost classStyles={`border-${setColorContent} text-white bg-black text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
                                w-full rounded-md h-[48px] ${buttonWidth}`}
                                text={textBoton1 as string} href={linkBoton1 as string}
                                />
                            )}</>
                        )}
                       
                        {/* Boton de DESCARGAR LA APP que solo sera visible en pantallas pequeñas  */}
                        {button2Exist && (
                            <ButtonGhost classStyles="border-white text-black bg-white text-[18px] leading-6 font-bold hover:!bg-black hover:!text-white 
                            lg:hidden    w-full rounded-md h-[48px] w-[256px]  mt-5"
                            text={textBoton2 as string} href={linkBoton2 as string}
                            />
                        )}
                        </div>

                        {/* Imagenes y texto en pantallas pequeñas se esconde */}
                        {assetsExist && (
                        <div className=" hidden lg:block">
                            
                                <p className={`text-${setColorContent}`}>{textoDescarga}</p>

                                <div className="mt-2 flex flex-row">
                                    {imageStore1 && (
                                    <div className="relative 3xl:w-30 2xl:w-23 lg:w-25 h-10">
                                        <Image
                                        className=" object-contain"
                                        alt={'Images'}
                                        src={`https:${imageStore1}`}
                                        fill
                                        />
                                    </div>
                                    )}

                                    {imageStore2 && (
                                    <div className="relative 3xl:w-30 2xl:w-23 lg:w-25 h-10">
                                        <Image
                                        className=" object-contain"
                                        alt={'Images'}
                                        src={`https:${imageStore2}`}
                                        loading="lazy"
                                        fill
                                        />
                                    </div>
                                    )}
                                </div>
                            
                        </div>

                        )}
                        
                    </div>
                </div>
            </div>
        </div>
        </div>
    )

}

export default IzziGoBloque