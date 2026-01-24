import React from 'react'
import Image from 'next/image'
import CardHomeComponent from '../molecules/CardHomeComponent'
import CarouselComponent from '../molecules/CarouselComponent'
import { CarouselProvider } from '@/utils/CarouselProvider'
import { CarouselCardProps } from '@/types/CarouselCardTypes'
import { contentfulClient } from '@/services/contentful/client'
import { Asset, Entry, EntrySkeletonType } from 'contentful'
import {CARDHOMECOMPONENT, CARDTVPAQUETESCOMPONENT} from '@/constants/CardComponent';
import CardTVInternetMovilComponent from '../molecules/CardTVInternetMovilComponent'
import CardTvPaquetesComponent from '../molecules/CardTVPaquetesComponente';
import { colorPickerType } from '@/types/ColorPickerType'
import RichTextComponent from '../molecules/RichTextComponent'
import { Document } from '@contentful/rich-text-types'

const CarouselCardComponent = async ({id, recomendador}:CarouselCardProps) => {

  // Obtener informacion de los carruseles desde contentful

    const entryCarousel:Entry<EntrySkeletonType, undefined, string>[] | null = recomendador ? recomendador : await contentfulClient.getEntries({
      content_type: "carouselCardHomeModel",
      'sys.id': id,
      select: ['fields.backgroundImage', 'fields.backgroundImageMobile' , 'fields.cardsCarousel', 'fields.bgColor', 'fields.colorArrow', 'fields.title'],
      include: 2,
    }).then((entriesResponse) => {
      return entriesResponse.items
    })

    const imgBackground = entryCarousel?.[0].fields?.backgroundImage as Asset;
    const imgBackgroundMobile = entryCarousel?.[0].fields?.backgroundImageMobile as Asset;
    const colorArrow = entryCarousel?.[0].fields?.colorArrow as string;

    const cardsData = entryCarousel?.[0].fields?.cardsCarousel || [];
    const cardsArray = cardsData as Entry<EntrySkeletonType>[];
    const hasPromo = cardsArray.some(item => Boolean(item.fields?.tagPromo));


  return (
    <div 
      className="CarouselCardComponent relative w-full h-full flex justify-center items-center flex-wrap "
      style={{ 
        backgroundColor: entryCarousel?.[0].fields?.bgColor 
          ? (entryCarousel?.[0].fields?.bgColor as colorPickerType)?.value 
          : '#000000' 
      }}
    >
      {imgBackground?.fields?.file?.url && (
        <div className="absolute inset-0 z-0">
          <picture>
            <source 
              media="(max-width: 1023px)" 
              srcSet={`https:${imgBackgroundMobile?.fields?.file?.url}`} 
            />
            <Image
              src={`https:${imgBackground.fields.file.url}`}
              alt={String(imgBackground.fields.title) || 'Background image'}
              fill
              priority
              className="object-cover [@media(min-width:2000px)]:object-fill"
              sizes="100vw"
              quality={75}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>
      )}

      {
        entryCarousel && entryCarousel[0]?.fields?.title && !recomendador ? (
          <div className='mb-10 text-center titulo-carousel-card'>
          <RichTextComponent document={entryCarousel[0]?.fields?.title as Document} />
          </div>
        ) : null
      }
        {/*         [@media(min-width:2000px)]:ml-[11vw]                                   */}
        <div className="relative z-10 w-full h-full  2xl:ml-lg   3xl:ml-0 4xl:ml-[3%] 
        [@media(min-width:2000px)]:w-[90%] [@media(min-width:3840px)]:w-[87%]
        [@media(min-width:2000px)]:ml-[7.5%] [@media(min-width:3840px)]:ml-[11.5%]

        ">
          <CarouselProvider qtyCarousels={1} carouselConfigs={[{ options: { align: 'center'} }]} colorArrow={colorArrow}>
             <CarouselComponent buttons={true} dots={true}>
                {
                  entryCarousel && entryCarousel[0]?.fields.cardsCarousel && Array.isArray(entryCarousel[0].fields.cardsCarousel) && (entryCarousel[0].fields.cardsCarousel as Entry<EntrySkeletonType, undefined, string>[]).map((card:Entry<EntrySkeletonType, undefined, string>, index:number) => {
                    if( card.fields.type === CARDHOMECOMPONENT) {
                      return <CardHomeComponent key={index} card={card} promo={hasPromo} index={index}/>
                    }
                    else if (typeof card.fields.type && card.fields.type !== CARDHOMECOMPONENT && card.fields.type !== CARDTVPAQUETESCOMPONENT) {
                      return <CardTVInternetMovilComponent key={index} card={card} promo={hasPromo} index={index}/>
                    }
                    else if (typeof card.fields.type === 'string' && CARDTVPAQUETESCOMPONENT.includes(card.fields.type)) {
                      return <CardTvPaquetesComponent key={index} card={card} promo={hasPromo} index={index}/>
                    }
                    return null;
                  })
                }
             </CarouselComponent>
          </CarouselProvider>
        </div>
    </div>
  )
}

export default CarouselCardComponent