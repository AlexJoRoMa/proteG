"use client"

import { CarouselComponentType } from '@/types/CarouselTypes'
import { useCarouselByIndex } from '@/utils/CarouselProvider'

const CarouselComponent = ({children, carouselIndex = 0}:CarouselComponentType) => {

    const {emblaRef} = useCarouselByIndex(carouselIndex)

  return (
        <div className="embla" >
          <div className="embla__viewport"  ref={emblaRef}>
            <div className="embla__container">
              {/* Aquí puedes mapear tus canales */}
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="embla__slide">
                    {children}
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default CarouselComponent
