import Image from "next/image";
import { ConIzziTvID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/ConIzziTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const ConIzziTv = async ({id} : ConIzziTvID) =>{
    
    const callComponents: Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
            content_type: "izziTvModelTop",
            'sys.id': id,
            select: ['fields.imgNumber',
            'fields.imagen',
            'fields.imagenDesk',
            'fields.imagenMovil',
            'fields.richTitle', 
            'fields.body',
            'fields.textoPrecio',
            'fields.precio',
            'fields.textTiempo',
            'fields.incluye',
            'fields.textBoton1',
            'fields.linkBoton1',
            'fields.adicionales',
             ],
            include: 2,
        }).then((entriesResponse) => {
            return entriesResponse.items
        })
    
    if(!callComponents){
        return null;
    }
    
    const getComponentContent= callComponents[0] as unknown as Entry<StepTabEntrySkeleton>;
   
    const { richTitle, body, textoPrecio, precio, textTiempo, incluye,  
            textBoton1, linkBoton1, adicionales, imgNumber ,imagen, imagenMovil, imagenDesk }= getComponentContent.fields as StepTabEntryFields;

    const assetImage = imagen?.fields?.image as Asset | undefined;
    const imgURL = assetImage?.fields?.file?.url;

    const movilImage = imagenMovil?.fields?.image as Asset | undefined;
    const movilURL = movilImage?.fields?.file?.url;

    const deskImage = imagenDesk?.fields?.image as Asset | undefined;
    const deskURL = deskImage?.fields?.file?.url;


    console.log('>>>> deskImage ', deskImage);

    return(
    <div className=" bg-black flex md:w-full xsm:w-full md:h-[489px] xsm:h-[770px] overflow-hidden">
        <div key={getComponentContent.sys.id} className=" relative w-full flex flex-col md:flex-row">
            
            {/* contenido texto */}
            <div className="  relative md:order-none xsm:order-1 w-1/2  z-10 md:mx-md 2xl:mx-xl 
            md:pl-[1%] xsm:ml-4 
            md:w-[400px] xsm:w-[92%] md:h-[85%] xsm:h-[360px] 
            md:mt-10  xsm:mt-15">
                <div  className=" text-white md:text-[64px] xsm:text-[56px]">
                    {richTitle && documentToReactComponents(richTitle)}
                </div>
                <div  className="  text-white md:text-[32px] xsm:text-[24px] xsm:w-[80%] md:w-full ">
                    <h1>{body}</h1>
                </div>
                
                <div  className="  text-white">
                    <p>
                        <span className="md:text-[16px] xsm:text-[14px]">{textoPrecio}</span>
                        <span className="md:text-[56px] xsm:text-[48px] ml-4">{precio} </span>
                        <span className="md:text-[16px] xsm:text-[14px]">{textTiempo}</span>
                    </p>
                </div>
                    
                <div  className="  flex w-full text-white text-[16px] mt-1 h-[24px]">
                    <p className="whitespace-nonwrap">{incluye}</p>
                        
                    {adicionales && (
                        <div className="  grid grid-cols-4 grid-rows-2 gap-2 ml-4 mt-[6px]">
                            { adicionales?.map((assets: Asset) => {
                                const url = assets.fields?.file?.url;
                                return (
                                    <div key={assets.sys.id} >
                                        <Image
                                        className="w-auto h-[14px] "
                                        src={`https:${url}`}
                                        alt={'adicional'}
                                        priority
                                        width={150}
                                        height={14}
                                        quality={80}
                                        />
                                    </div>
                                    );
                                })}
                         </div>
                     )}
                </div>
                <div className=" flex md:justify-start md:items-start xsm:justify-center xsm:items-center">
                    <ButtonGhost classStyles="border-white text-black text-[16px] leading-6 font-bold bg-white 
                    hover:!bg-white hover:!text-black w-full rounded-md md:mt-5 xsm:mt-8 
                    h-[48px] md:w-[320px] xsm:w-[256px] "
                    text={textBoton1 as string} href={linkBoton1 as string}
                    />
                </div>
                    
            </div>

           <div className=" z-10  h-[489px] flex items-center justify-start">
            {imgNumber === false && (
                    <div className="">
                        <Image
                        className=" object-contain"
                        alt={'Images'}
                        src={`https:${deskURL}`}
                        loading="lazy"
                        width={589}
                        height={466}
                        />
                    </div>
            )}
           </div>
                
            {/* imagen responsiva */}
            <div className=" md:w-full xsm:w-[92%] md:h-full xsm:h-[280px]
                md:absolute md:inset-0 md:z-0 md:mt-0 xsm:mt-7 md:ml-0 xsm:ml-4
                xsm:relative xsm:z-10 md:order-none xsm:order-2">
                    
                    <picture className="block ">
                        <source media="(max-width:576px)" srcSet={`https:${movilURL}`}/>
                        {( imgURL && movilURL ) && (
                            <Image
                            alt={'Images'}
                            src={`https:${ imgURL || movilURL}`}
                            fill
                            priority
                            sizes=" 100vw"
                            quality={75}
                            />
                        )}
                    </picture>
                </div>
            </div>
            
    </div>
    );
 }


export default ConIzziTv