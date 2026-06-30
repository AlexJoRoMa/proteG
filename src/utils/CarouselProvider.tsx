"use client"

import { createContext, useCallback, useContext, useState, useMemo } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaOptionsType } from "embla-carousel"
import Fade from "embla-carousel-fade"
import { CarouselContextType } from "@/types/CarouselTypes"
import { OPTIONS } from "@/constants/CarouselConstants"
import AutoHeight from "embla-carousel-auto-height"
import AutoPlay from "embla-carousel-autoplay"

const CarouselContext = createContext<CarouselContextType | undefined>(undefined)

export const useCarousel = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel debe usar un CarouselProvider")
  }
  return context
}

// Obtiene un carousel específico por su índice
export const useCarouselByIndex = (index: number) => {
  const context = useCarousel()
  return {
    emblaApi: context.emblaApis[index],
    emblaRef: context.emblaRefs[index],
    syncAllCarouselsToSlide: context.syncAllCarouselsToSlide,
    pauseAllAutoplay: context.pauseAllAutoplay,
  }
}

// Client component que permite manejar múltiples carousels
export const CarouselProvider = ({ 
  children, 
  qtyCarousels = 1,
  carouselConfigs = [],
  colorArrow = "white"
}: { 
  children: React.ReactNode, 
  qtyCarousels?: number,
  carouselConfigs?: { options?: EmblaOptionsType, plugins?: string[] }[],
  colorArrow?: string
}) => {

  // Funcion para resolver plugins basados en nombres
  const resolvePlugins = (pluginNames?: string[]) => {
    if (!pluginNames) return undefined
    const plugins = pluginNames.map(name => {
      switch (name) {
        case 'fade':
          return Fade()
        case 'autoheight':
          return AutoHeight()

        case 'autoplay':
          return AutoPlay({playOnInit: true, delay: 3000, stopOnFocusIn : false, stopOnInteraction: false, jump: false, stopOnMouseEnter : false})  

        default:
          return null
      }
    }).filter((plugin): plugin is NonNullable<typeof plugin> => plugin !== null)
    
    return plugins.length > 0 ? plugins : undefined
  }

  const carousel1 = useEmblaCarousel(carouselConfigs[0]?.options || OPTIONS, resolvePlugins(carouselConfigs[0]?.plugins))
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  const carousel2 = qtyCarousels >= 2 ? useEmblaCarousel(carouselConfigs[1]?.options || OPTIONS, resolvePlugins(carouselConfigs[1]?.plugins)) : [null, undefined]
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  const carousel3 = qtyCarousels >= 3 ? useEmblaCarousel(carouselConfigs[2]?.options || OPTIONS, resolvePlugins(carouselConfigs[2]?.plugins)) : [null, undefined]
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  const carousel4 = qtyCarousels >= 4 ? useEmblaCarousel(carouselConfigs[3]?.options || OPTIONS, resolvePlugins(carouselConfigs[3]?.plugins)) : [null, undefined]
  
  // El carrusel activo se maneja con un índice
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Crea un array de referencias y APIs de todos los carousels
  const allRefs = [carousel1[0], carousel2[0], carousel3[0], carousel4[0]] as ((node: HTMLDivElement | null) => void)[]
  const allApis = useMemo(() => [carousel1[1], carousel2[1], carousel3[1], carousel4[1]], [carousel1, carousel2, carousel3, carousel4])
  

  const emblaRef = allRefs[activeIndex] 
  const emblaApi = allApis[activeIndex]

    // Funcion para sincronizar todos los carousels a un slide específico
  const syncAllCarouselsToSlide = useCallback((slideIndex: number) => {
    allApis.forEach(api => {
      if (api) {
        api.scrollTo(slideIndex)
      }
    })
  }, [allApis])

    const pauseAllAutoplay = useCallback(() => {
    allApis.forEach(api => {
      if (api && api.plugins() && api.plugins().autoplay) {
        api.plugins().autoplay.stop();
      }
    });
  }, [allApis]);

  
  return (
    <CarouselContext.Provider value={{ 
      emblaRef, 
      emblaApi,
      emblaApis: allApis,
      emblaRefs: allRefs,
      setActiveCarousel: setActiveIndex,
      activeCarouselIndex: activeIndex,
      syncAllCarouselsToSlide,
      pauseAllAutoplay,
      colorArrow
    }}>
      {children}
    </CarouselContext.Provider>
  )
}