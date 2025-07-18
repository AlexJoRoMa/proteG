import { EmblaCarouselType } from "embla-carousel"


export type CarouselContextType = {
  
  emblaApi: EmblaCarouselType | null | undefined
  emblaRef: (node: HTMLDivElement | null) => void
  
  
  emblaApis: (EmblaCarouselType | null | undefined)[]
  emblaRefs: ((node: HTMLDivElement | null) => void)[]
  
  
  setActiveCarousel: (index: number) => void
  activeCarouselIndex: number

  
  syncAllCarouselsToSlide: (slideIndex: number) => void,

  pauseAllAutoplay: () => void,
}


export type CarouselThumbsButtonsType = {
  selected: boolean
  index: number
  onClick: () => void
}

export type CarouselComponentType = {
    children: React.ReactNode,
    carouselIndex?: number,
    buttons?: boolean,
    dots?: boolean
}

export type ChannelPromoBannerProps = {
  id: string;
}
