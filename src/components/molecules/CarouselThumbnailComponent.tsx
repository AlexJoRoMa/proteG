"use client"


import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'
import CarouselThumbsButtons from './CarouselThumbsButtons'
import {useCarouselByIndex } from '@/utils/CarouselProvider'
import CarouselArrowsComponent from './CarouselArrowsComponent'

type CarouselThumbnailProps = {
    targetCarouselIndex?: number,
    syncAllCarousels:boolean,
    children?: React.ReactNode
}

const CarouselThumbnailComponent = ({targetCarouselIndex=0, syncAllCarousels = false, children:childrenButtons}:CarouselThumbnailProps) => {

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
        // Sincronizar todos los carruseles
        syncAllCarouselsToSlide(index)
      } else {
        // Solamente desplazar el carrusel actual
        emblaApi.scrollTo(index)
      }
    },
    [emblaApi, emblaThumbsApi, syncAllCarousels, syncAllCarouselsToSlide]
  )

const scrollPrev = useCallback(() => {
  if (!emblaApi) return
  if (syncAllCarousels) {
    // Si se sincronizan todos los carruseles, obtenemos el índice actual
    const currentIndex = emblaApi.selectedScrollSnap()
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : emblaApi.scrollSnapList().length - 1
    syncAllCarouselsToSlide(prevIndex)
  } else {
    // Si no se sincronizan, simplemente desplazamos al anterior
    emblaApi.scrollPrev()
  }
}, [emblaApi, syncAllCarousels, syncAllCarouselsToSlide])

const scrollNext = useCallback(() => {
  if (!emblaApi) return
  if (syncAllCarousels) {
    const currentIndex = emblaApi.selectedScrollSnap()
    const nextIndex = currentIndex < emblaApi.scrollSnapList().length - 1 ? currentIndex + 1 : 0
    syncAllCarouselsToSlide(nextIndex)
  } else {
    emblaApi.scrollNext()
  }
}, [emblaApi, syncAllCarousels, syncAllCarouselsToSlide])

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


  const childrenArray = React.Children.toArray(childrenButtons)

  return (
  <div className="embla-thumbs relative w-3/4 sm:w-full">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
                {childrenArray.map((child, index) => (
              <CarouselThumbsButtons
                    key={index}
                    onClick={() => onThumbClick(index)}
                    selected={index === selectedIndex}
                    index={index}>
                      {child}
              </CarouselThumbsButtons>
            ))}
          </div>
        </div>

        <CarouselArrowsComponent scrollPrev={scrollPrev} scrollNext={scrollNext} classPrevButton="absolute -left-9 top-[10px] cursor-pointer" classNextButton='absolute -right-9 top-[10px] cursor-pointer'/>
    </div>
  )
}

export default CarouselThumbnailComponent
