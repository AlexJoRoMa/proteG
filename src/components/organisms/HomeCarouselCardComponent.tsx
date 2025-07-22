import React from 'react'
import Image from 'next/image'
import CardHomeComponent from '../molecules/CardHomeComponent'
import CarouselComponent from '../molecules/CarouselComponent'
import { CarouselProvider } from '@/utils/CarouselProvider'
import { HomeCarouselCardProps } from '@/types/HomeCarouselCardTypes'
import { contentfulClient } from '@/services/contentful/client'
import { Asset, Entry, EntrySkeletonType } from 'contentful'

const HomeCarouselCardComponent = async ({id}:HomeCarouselCardProps) => {

  // Obtener informacion de los carruseles desde contentful

   const entryCarousel:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
      content_type: "carouselCardHomeModel",
      'sys.id': id,
      select: ['fields.backgroundImage', 'fields.backgroundImageMobile' , 'fields.cardsCarousel']
    }).then((entriesResponse) => {
      return entriesResponse.items
    })

    const imgBackground = entryCarousel?.[0].fields?.backgroundImage as Asset;
    const imgBackgroundMobile = entryCarousel?.[0].fields?.backgroundImageMobile as Asset;
  
  return (
    <div className='HomeCarouselCardComponent relative w-full h-full'>
      {/* Imagen de fondo del carrusel */}
        {imgBackground?.fields?.file?.url && (
          <picture>
            <source media="(max-width: 1023px)" srcSet={`https:${imgBackgroundMobile?.fields?.file?.url}`} />
            <Image
              src={`https:${imgBackground.fields.file.url}`}
              alt={String(imgBackground.fields.title) || 'Background image'}
              fill
              priority
              className=""
              sizes="100vw"
              quality={100}
            />
          </picture>
        )}
        
        {/* Contenido del carousel con z-index para estar por encima de la imagen */}
        <div className="relative z-10 w-full h-full">
          <CarouselProvider qtyCarousels={1} carouselConfigs={[{ options: { align: 'start' } }]} >
             <CarouselComponent buttons={true} dots={true}>
                {
                  entryCarousel && entryCarousel[0]?.fields.cardsCarousel && Array.isArray(entryCarousel[0].fields.cardsCarousel) && (entryCarousel[0].fields.cardsCarousel as Entry<EntrySkeletonType, undefined, string>[]).map((card:Entry<EntrySkeletonType, undefined, string>, index:number) => (
                    <CardHomeComponent key={index} card={card} />
                  ))
                }
             </CarouselComponent>
          </CarouselProvider>
        </div>
    </div>
  )
}

export default HomeCarouselCardComponent