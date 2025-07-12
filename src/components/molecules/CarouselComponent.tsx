"use client"

import { CarouselComponentType } from '@/types/CarouselTypes'
import { useCarouselByIndex } from '@/utils/CarouselProvider'
import React from 'react'
import CarouselArrowsComponent from './CarouselArrowsComponent'
import { CarouselDotButtonsComponent, useDotButton } from './CarouselDotButtonsComponent'
import { EmblaCarouselType } from 'embla-carousel'

const CarouselComponent = ({children, carouselIndex = 0, buttons = false, dots = false}:CarouselComponentType) => {

    const {emblaRef, emblaApi} = useCarouselByIndex(carouselIndex)

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi as EmblaCarouselType)

      const childrenArray = React.Children.toArray(children)

  return (
        <div className="embla" >
          <div className="embla__viewport"  ref={emblaRef}>
            <div className="embla__container">
                {childrenArray.map((child, index) => (
                    <div key={index} className="embla__slide">
                    {child}
                    </div>
                ))}
            </div>
          </div>

          {
              buttons && (
                <CarouselArrowsComponent
                    scrollPrev={() => emblaApi?.scrollPrev()}
                    scrollNext={() => emblaApi?.scrollNext()}
                />
              )
          }

          {
            dots && (
            <div className="embla__dots">
              {scrollSnaps.map((_, index) => (
                <CarouselDotButtonsComponent
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={'embla__dot'.concat(
                    index === selectedIndex ? ' embla__dot--selected' : ''
                  )}
                />
              ))}
            </div>
            )
          }

 
        </div>
  )
}

export default CarouselComponent
