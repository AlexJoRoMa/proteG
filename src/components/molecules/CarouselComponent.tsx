"use client"

import { CarouselComponentType } from '@/types/CarouselTypes'
import { useCarouselByIndex } from '@/utils/CarouselProvider'
import React, {useState, useEffect} from 'react'
import CarouselArrowsComponent from './CarouselArrowsComponent'
import { CarouselDotButtonsComponent, useDotButton } from './CarouselDotButtonsComponent'
import { EmblaCarouselType } from 'embla-carousel'

const CarouselComponent = ({children, carouselIndex = 0, buttons = false, dots = false}:CarouselComponentType) => {

    const {emblaRef, emblaApi} = useCarouselByIndex(carouselIndex)

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi as EmblaCarouselType)

    const childrenArray = React.Children.toArray(children)

    
const [justifyCenter, setJustifyCenter] = useState(false)

useEffect(() => {
  if (!emblaApi) return
  const update = () => {
    setJustifyCenter(!emblaApi.canScrollPrev() && !emblaApi.canScrollNext())
  }
  emblaApi
    .on('init', update)
    .on('reInit', update)
    .on('select', update)
  update()
}, [emblaApi])


  return (
        <div className="embla" >
          <div className="embla__viewport overflow-hidden"  ref={emblaRef}>
            <div className={`embla__container flex ${justifyCenter ? 'justify-center' : ''}`}>
                {childrenArray.map((child, index) => (
                    <div key={index} className="
embla__slide
                px-2
                basis-[85%] sm:basis-[60%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4
                flex justify-center
">
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
                    emblaApi={emblaApi as EmblaCarouselType}
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
