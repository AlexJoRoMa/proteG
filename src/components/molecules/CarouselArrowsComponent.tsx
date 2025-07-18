import Image from "next/image"
import { EmblaCarouselType } from 'embla-carousel'
import { useCallback, useEffect, useState } from "react"

type CarouselArrowsComponentProps = {
    scrollPrev: () => void
    scrollNext: () => void
    classPrevButton?: string
    classNextButton?: string,
    emblaApi?: EmblaCarouselType
}

const CarouselArrowsComponent = ({scrollPrev, scrollNext, classPrevButton, classNextButton, emblaApi}:CarouselArrowsComponentProps) => {

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
        <Image
          src="/FlechaIzquierda.webp"
          alt="Prev"
          width={32}
          height={32}/>
      </button>
      <button title="Next" aria-label="Next" type="button" className={`embla__next ${classNextButton}`} onClick={scrollNext} disabled={nextBtnDisabled}>
        <Image
          src="/FlechaDerecha.webp"
          alt="Next"
          width={32}
          height={32}/>
      </button>
    </>
  )
}

export default CarouselArrowsComponent
