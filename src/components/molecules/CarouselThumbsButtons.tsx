import { CarouselThumbsButtonsType } from "@/types/CarouselTypes"


const CarouselThumbsButtons = ({selected, index, onClick}:CarouselThumbsButtonsType) => {

  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        {index + 1}
      </button>
    </div>
  )
}

export default CarouselThumbsButtons
