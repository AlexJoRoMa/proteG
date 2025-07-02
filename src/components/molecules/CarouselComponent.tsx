"use client"

import { useCarouselByIndex } from '@/utils/CarouselController'

type CarouselProps = {
    children: React.ReactNode,
    carouselIndex?: number
}

const CarouselComponent = ({children, carouselIndex = 0}:CarouselProps) => {

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
