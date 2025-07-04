"use client"

import { CarouselComponentType } from '@/types/CarouselTypes'
import { useCarouselByIndex } from '@/utils/CarouselProvider'
import React from 'react'

const CarouselComponent = ({children, carouselIndex = 0}:CarouselComponentType) => {

    const {emblaRef} = useCarouselByIndex(carouselIndex)

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
        </div>
  )
}

export default CarouselComponent
