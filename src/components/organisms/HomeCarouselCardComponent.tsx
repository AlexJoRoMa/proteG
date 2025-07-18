import React from 'react'
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
      select: ['fields.backgroundImage', 'fields.cardsCarousel']
    }).then((entriesResponse) => {
      return entriesResponse.items
    })

    const imgBackground = entryCarousel?.[0].fields?.backgroundImage as Asset;
  
  return (
    <div className='HomeCarouselCardComponent bg-no-repeat bg-size-[100%_100%]' style={{backgroundImage: `url(https:${imgBackground?.fields?.file?.url})`}} >
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
  )
}

export default HomeCarouselCardComponent
