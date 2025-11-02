import Image from "next/image";
import { ConIzziTvID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/ConIzziTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import RichTextComponent from "../molecules/RichTextComponent";
import '@/styles/TopBannerComponent.css'
import ButtonLanding from '@/components/atoms/ButtonStickyLanding'

import ButtonGhost from '../atoms/ButtonGhost'
const ConIzziTv = async ({id} : ConIzziTvID) =>{
    
    const callComponents: Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
            content_type: "izziTvModelTop",
            'sys.id': id,
            select: ['fields.imagen',
            'fields.imagenMovil',
            'fields.content',
            'fields.image',
            'fields.imageResponsive',
            'fields.textBoton1',
            'fields.linkBoton1',
            'fields.landing',
            'fields.terminos'
             ],
            include: 2,
        }).then((entriesResponse) => {
            return entriesResponse.items
        })
    
    if(!callComponents){
        return null;
    }
    
    const getComponentContent= callComponents[0] as unknown as Entry<StepTabEntrySkeleton>;
   
    const { imagen, imagenMovil, content, image, imageResponsive, textBoton1, linkBoton1, landing, terminos }= getComponentContent.fields as StepTabEntryFields;

    const assetImage = imagen?.fields?.image as Asset | undefined;
    const imgURL = assetImage?.fields?.file?.url;

    const movilImage = imagenMovil?.fields?.image as Asset | undefined;
    const movilURL = movilImage?.fields?.file?.url;

    

    return(
    <div className={` relative bg-black flex md:w-full xsm:w-full h-auto overflow-hidden 4xl:px-[200px] 2xl:px-[144px] xl:px-[80px] md:px-[80px] xsm:px-[16px] md:py-10  xsm:py-15 ${!content && 'min-h-[520px]'}`}>
        <div key={getComponentContent.sys.id} className="w-full flex flex-col md:flex-row">
            

            {/*Nueva version con RichText */}

            <div className=" relative md:order-none xsm:order-1 z-10  h-auto md:max-w-6/12 ">
                <div className="xsm:flex xsm:flex-col xsm:items-center md:items-start">
                    {content && <RichTextComponent document={content} className="topBannerComponent" />}
                    
                    {landing === true && (
                        <ButtonLanding textBoton={textBoton1 as string} landing={landing} />
                    )} 
                    {linkBoton1 && (
                        <ButtonGhost  classStyles='md:w-[320px] xsm:w-[256px] h-[48px] rounded-md bg-white text-black
                         border-none font-bold text-[16px] md:text-[18px] mt-5 mb-5'
                        text={textBoton1 as string} href={linkBoton1 as string}  />
                    )}
                    
                    {terminos && (
                        <p className="text-[14px] text-white mt-5 mb-5">
                            {terminos}
                        </p>
                    )}
                </div>
            </div>

            {/*Imagen del lado derecho del banner mb-10 md:mb-0*/}

            <div className={`z-1  xsm:mt-5 md:m-auto 3xl:mt-0 ml-auto xsm:order-2 md-order-none ${movilURL && !image && 'md:hidden'}`}>
                <picture>
                    <source media="(max-width:576px)" srcSet={`https:${imageResponsive?.fields?.file?.url || movilURL}`}/>
                    {( image?.fields?.file?.url && imageResponsive?.fields?.file?.url || movilURL ) && (
                        <Image
                        alt={'Images'}
                        src={`https:${ image?.fields?.file?.url || imageResponsive?.fields?.file?.url || movilURL}`}
                        width={(image?.fields?.file?.details as import("contentful").AssetDetails).image?.width || 600}
                        height={(image?.fields?.file?.details as import("contentful").AssetDetails).image?.height || 400}
                        />
                    )}
                </picture>
            </div>


                
            {/* imagen responsiva */}

                    <picture className={`xsm:hidden md:block ${movilURL && image && 'xsm:!block'}`}>
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
    );
 }


export default ConIzziTv