"use client"


import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'
import CarouselThumbsButtons from './CarouselThumbsButtons'
import {useCarouselByIndex } from '@/utils/CarouselController'

type CarouselThumbnailProps = {
    targetCarouselIndex?: number,
    syncAllCarousels:boolean
}

const CarouselThumbnailComponent = ({targetCarouselIndex=0, syncAllCarousels = false }:CarouselThumbnailProps) => {

const { emblaApi, syncAllCarouselsToSlide } = useCarouselByIndex(targetCarouselIndex)

const [selectedIndex, setSelectedIndex] = useState(0)

const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !emblaThumbsApi) return
      
      if (syncAllCarousels) {
        // Sync all carousels to this slide
        syncAllCarouselsToSlide(index)
      } else {
        // Only control the target carousel
        emblaApi.scrollTo(index)
      }
    },
    [emblaApi, emblaThumbsApi, syncAllCarousels, syncAllCarouselsToSlide]
  )

const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap())
}, [emblaApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()

    emblaApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaApi, onSelect])



  return (
  <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">

             {Array.from({ length: 10 }).map((_, index) => (
                <CarouselThumbsButtons
                    key={index}
                    onClick={() => onThumbClick(index)}
                    selected={index === selectedIndex}
                    index={index}/>
            ))}

          </div>
        </div>
    </div>
  )
}

export default CarouselThumbnailComponent
