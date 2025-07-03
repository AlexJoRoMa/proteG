
type CarouselThumbsButtonsProps = {
  selected: boolean
  index: number
  onClick: () => void
  children?: React.ReactNode
}


const CarouselThumbsButtons = ({selected, onClick, children}:CarouselThumbsButtonsProps) => {

  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}
    >
      <div onClick={onClick} className="embla-thumbs__slide__image">
        {children}
      </div>
    </div>
  )
}

export default CarouselThumbsButtons
