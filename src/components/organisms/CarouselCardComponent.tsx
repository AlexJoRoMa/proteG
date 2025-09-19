import React from 'react'
import Image from 'next/image'
import CardHomeComponent from '../molecules/CardHomeComponent'
import CarouselComponent from '../molecules/CarouselComponent'
import { CarouselProvider } from '@/utils/CarouselProvider'
import { CarouselCardProps } from '@/types/CarouselCardTypes'
import { contentfulClient } from '@/services/contentful/client'
import { Asset, Entry, EntrySkeletonType } from 'contentful'
import {CARDHOMECOMPONENT, CARDTVINTERNETMOVILCOMPONENT, CARDTVPAQUETESCOMPONENT} from '@/constants/CardComponent';
import CardTVInternetMovilComponent from '../molecules/CardTVInternetMovilComponent'
import CardTvPaquetesComponent from '../molecules/CardTVPaquetesComponente';
import { colorPickerType } from '@/types/ColorPickerType'

const CarouselCardComponent = async ({id, recomendador}:CarouselCardProps) => {

  // Obtener informacion de los carruseles desde contentful

    const entryCarousel:Entry<EntrySkeletonType, undefined, string>[] | null = recomendador ? recomendador : await contentfulClient.getEntries({
      content_type: "carouselCardHomeModel",
      'sys.id': id,
      select: ['fields.backgroundImage', 'fields.backgroundImageMobile' , 'fields.cardsCarousel', 'fields.bgColor', 'fields.colorArrow'],
    }).then((entriesResponse) => {
      return entriesResponse.items
    })

    const imgBackground = entryCarousel?.[0].fields?.backgroundImage as Asset;
    const imgBackgroundMobile = entryCarousel?.[0].fields?.backgroundImageMobile as Asset;
    const colorArrow = entryCarousel?.[0].fields?.colorArrow as string;

  return (
    <div 
      className="CarouselCardComponent relative w-full h-full flex justify-center items-center"
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
              className="object-cover"
              sizes="100vw"
              quality={75}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>
      )}
        
        <div className="relative z-10 w-full h-full">
          <CarouselProvider qtyCarousels={1} carouselConfigs={[{ options: { align: 'start' } }]} colorArrow={colorArrow}>
             <CarouselComponent buttons={true} dots={true}>
                {
                  entryCarousel && entryCarousel[0]?.fields.cardsCarousel && Array.isArray(entryCarousel[0].fields.cardsCarousel) && (entryCarousel[0].fields.cardsCarousel as Entry<EntrySkeletonType, undefined, string>[]).map((card:Entry<EntrySkeletonType, undefined, string>, index:number) => {
                    if( card.fields.type === CARDHOMECOMPONENT) {
                      return <CardHomeComponent key={index} card={card} />
                    }
                    else if (typeof card.fields.type === 'string' && CARDTVINTERNETMOVILCOMPONENT.includes(card.fields.type)) {
                      return <CardTVInternetMovilComponent key={index} card={card} />
                    }
                    else if (typeof card.fields.type === 'string' && CARDTVPAQUETESCOMPONENT.includes(card.fields.type)) {
                      return <CardTvPaquetesComponent key={index} card={card} />
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