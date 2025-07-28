import { EmblaCarouselType } from 'embla-carousel'
import { useCallback, useEffect, useState } from "react"
import { CarouselArrowsComponentProps } from "@/types/CarouselTypes"
import { useCarousel } from "@/utils/CarouselProvider"

const CarouselArrowsComponent = ({scrollPrev, scrollNext, classPrevButton, classNextButton, emblaApi}:CarouselArrowsComponentProps) => {

  //Obtener color de las flechas
  const { colorArrow } = useCarousel()

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

    useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])
  
  return (
    <>
      <button title="Previous" aria-label="Previous" type="button" className={`embla__prev ${classPrevButton}`} onClick={scrollPrev} disabled={prevBtnDisabled}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
            <path d="M30 10.5L18 24.5L30 38.5" stroke={colorArrow} strokeWidth="1.5" strokeLinecap='round' strokeLinejoin='round'/>
          </svg>
      </button>
      <button title="Next" aria-label="Next" type="button" className={`embla__next ${classNextButton}`} onClick={scrollNext} disabled={nextBtnDisabled}>
        <svg xmlns="http://www.w3.org/2000/svg"  width="48" height="49" viewBox="0 0 48 49" fill="none">
          <path d="M18 10.5L30 24.5L18 38.5" stroke={colorArrow} strokeWidth="1.5" strokeLinecap='round' strokeLinejoin='round'/>
        </svg>
      </button>
    </>
  )
}

export default CarouselArrowsComponent
