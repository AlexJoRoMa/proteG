"use client"

import { createContext, useCallback, useContext, useState, useMemo } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel"
import Fade from "embla-carousel-fade"

const OPTIONS: EmblaOptionsType = {}

// Update context type to support multiple carousels
type CarouselContextType = {
  // The currently active embla API and ref
  emblaApi: EmblaCarouselType | null | undefined
  emblaRef: (node: HTMLDivElement | null) => void
  
  // For multiple carousels
  emblaApis: (EmblaCarouselType | null | undefined)[]
  emblaRefs: ((node: HTMLDivElement | null) => void)[]
  
  // Helper to set active carousel
  setActiveCarousel: (index: number) => void
  activeCarouselIndex: number

  // New function to sync all carousels to the same slide
  syncAllCarouselsToSlide: (slideIndex: number) => void
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined)

export const useCarousel = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider")
  }
  return context
}

// Get a specific carousel by index
export const useCarouselByIndex = (index: number) => {
  const context = useCarousel()
  return {
    emblaApi: context.emblaApis[index],
    emblaRef: context.emblaRefs[index],
    syncAllCarouselsToSlide: context.syncAllCarouselsToSlide
  }
}

// Client component that provides both emblaRef and emblaApi
export const CarouselController = ({ 
  children, 
  qtyCarousels = 1,
  carouselConfigs = []
}: { 
  children: React.ReactNode, 
  qtyCarousels?: number,
  carouselConfigs?: { options?: EmblaOptionsType, plugins?: string[] }[]
}) => {
  // Helper function to resolve plugins from strings
  const resolvePlugins = (pluginNames?: string[]) => {
    if (!pluginNames) return undefined
    const plugins = pluginNames.map(name => {
      switch (name) {
        case 'fade':
          return Fade()
        default:
          return null
      }
    }).filter((plugin): plugin is NonNullable<typeof plugin> => plugin !== null)
    
    return plugins.length > 0 ? plugins : undefined
  }

  // Create fixed-length arrays for all the hooks we need
  // We need to call all hooks unconditionally at the top level
  const carousel1 = useEmblaCarousel(carouselConfigs[0]?.options || OPTIONS, resolvePlugins(carouselConfigs[0]?.plugins))
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const carousel2 = qtyCarousels >= 2 ? useEmblaCarousel(carouselConfigs[1]?.options || OPTIONS, resolvePlugins(carouselConfigs[1]?.plugins)) : [null, undefined]
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const carousel3 = qtyCarousels >= 3 ? useEmblaCarousel(carouselConfigs[2]?.options || OPTIONS, resolvePlugins(carouselConfigs[2]?.plugins)) : [null, undefined]
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const carousel4 = qtyCarousels >= 4 ? useEmblaCarousel(carouselConfigs[3]?.options || OPTIONS, resolvePlugins(carouselConfigs[3]?.plugins)) : [null, undefined]
  
  // Current active carousel index (default to first)
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Create arrays of refs and APIs
  const allRefs = [carousel1[0], carousel2[0], carousel3[0], carousel4[0]] as ((node: HTMLDivElement | null) => void)[]
  const allApis = useMemo(() => [carousel1[1], carousel2[1], carousel3[1], carousel4[1]], [carousel1, carousel2, carousel3, carousel4])
  
  // Get the currently active ref and api
  const emblaRef = allRefs[activeIndex] 
  const emblaApi = allApis[activeIndex]

    // New function to sync all carousels to the same slide
  const syncAllCarouselsToSlide = useCallback((slideIndex: number) => {
    allApis.forEach(api => {
      if (api) {
        api.scrollTo(slideIndex)
      }
    })
  }, [allApis])
  
  return (
    <CarouselContext.Provider value={{ 
      emblaRef, 
      emblaApi,
      emblaApis: allApis,
      emblaRefs: allRefs,
      setActiveCarousel: setActiveIndex,
      activeCarouselIndex: activeIndex,
      syncAllCarouselsToSlide
    }}>
      {children}
    </CarouselContext.Provider>
  )
}