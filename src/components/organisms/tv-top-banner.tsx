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
            'fields.terminos',
            'fields.imgUrl'
             ],
            include: 2,
        }).then((entriesResponse) => {
            return entriesResponse.items
        })
    
    if(!callComponents){
        return null;
    }
    
    const getComponentContent= callComponents[0] as unknown as Entry<StepTabEntrySkeleton>;
   
    const { imagen, imagenMovil, content, image, imageResponsive, textBoton1, linkBoton1, landing, terminos, imgUrl }= getComponentContent.fields as StepTabEntryFields;

    const assetImage = imagen?.fields?.image as Asset | undefined;
    const imgDesk = assetImage?.fields?.file?.url;

    const movilImage = imagenMovil?.fields?.image as Asset | undefined;
    const imgMobil = movilImage?.fields?.file?.url;

    const setImgURL = imgUrl ? imgUrl : '';

    return(
    <div className={` relative bg-black flex md:w-full xsm:w-full h-auto overflow-hidden 4xl:px-[200px] 2xl:px-[144px] xl:px-[80px] md:px-[80px] xsm:px-[16px] md:py-10  xsm:py-15 ${!content && 'min-h-[520px]'}`}>
        
        <div key={getComponentContent.sys.id} className=" w-full flex flex-col md:flex-row ">
            

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

            {/*Imagen del banner mb-10 md:mb-0*/}
            

            <div className={`z-1  xsm:mt-5 md:m-auto 3xl:mt-0 ml-auto xsm:order-2 md-order-none ${imgMobil && !image && 'md:hidden'}`}>
                <a href={`${setImgURL}`}>
                <picture>
                    <source media="(max-width:576px)" srcSet={`https:${imageResponsive?.fields?.file?.url || imgMobil}`}/>
                    {( image?.fields?.file?.url && imageResponsive?.fields?.file?.url || imgMobil ) && (
                        <Image
                        alt={'Images'}
                        src={`https:${ image?.fields?.file?.url || imageResponsive?.fields?.file?.url || imgMobil}`}
                        width={(image?.fields?.file?.details as import("contentful").AssetDetails).image?.width || 600}
                        height={(image?.fields?.file?.details as import("contentful").AssetDetails).image?.height || 400}
                        />
                    )}
                </picture>
                </a>  
            </div>


            {/* imagen fondo */}
            <a href={`${setImgURL}`}>
            <picture className={`absolute top-0 left-0 w-full h-full xsm:hidden md:block ${imgMobil && image && 'xsm:!block '} `}>
                <source media="(max-width:576px)" srcSet={`https:${imgMobil}`}/>
                {( imgDesk && imgMobil ) && (
                    <Image
                    alt={'Images'}
                    src={`https:${ imgDesk || imgMobil}`}
                    width={1600}
                    height={518}
                    className="w-full h-full object-cover 2xl:object-fill"
                    priority
                    sizes=" 100vw"
                    quality={90}
                    />
                )}
            </picture>
            </a>

        </div>
        
    </div>
    );
 }


export default ConIzziTv