import Image from "next/image"

type CarouselArrowsComponentProps = {
    scrollPrev: () => void
    scrollNext: () => void
    classPrevButton?: string
    classNextButton?: string
}

const CarouselArrowsComponent = ({scrollPrev, scrollNext, classPrevButton, classNextButton}:CarouselArrowsComponentProps) => {
  return (
    <>
      <button title="Previous" aria-label="Previous" type="button" className={`embla__prev ${classPrevButton}`} onClick={scrollPrev}>
        <Image
          src="/FlechaIzquierda.webp"
          alt="Prev"
          width={32}
          height={32}/>
      </button>
      <button title="Next" aria-label="Next" type="button" className={`embla__next ${classNextButton}`} onClick={scrollNext}>
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
