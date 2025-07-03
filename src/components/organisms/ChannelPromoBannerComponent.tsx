
import Image from "next/image"
import ButtonGhost from '../atoms/ButtonGhost';
import CarouselComponent from "../molecules/CarouselComponent";
import CarouselThumbnailComponent from "../molecules/CarouselThumbnailComponent";
import { CarouselProvider } from "@/utils/CarouselProvider";
import { EmblaOptionsType } from 'embla-carousel';

const ChannelPromoBannerComponent = () => {

  const carouselOptions = [
          {}, // Carrusel de imágenes (default)
          {options: {dragFree:false, watchDrag: false, watchSlides: false, watchResize: true}, plugins: ['fade']}, // Carrusel de logos (default)  
          { options: { loop: true, breakpoints: {
            '(max-width: 420px)': { containScroll: false, slidesToScroll: 1},
          } }, plugins: ['fade'] } // Carrusel de texto con fade
   ] as { options?: EmblaOptionsType, plugins?: string[] }[]

   //TODO Remove this data and use contentful
     const thumbnailData = [
    { src: "https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp", alt: "LaLiga" },
    { src: "https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp", alt: "Ligue1" },
    { src: "https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp", alt: "Premier League" },
    { src: "https://images.ctfassets.net/lx4ov5kud2ld/5w7AHXzn9SQKgPOffEsCUb/20830fabf9de670eada6c9c4d919c20d/hazlointernacional.webp", alt: "Hazlo Internacional" },
  ]
      
  return (
    <section className="relative min-h-[740px] max-h-[908px] md:h-full h-[908px] flex flex-col md:flex-wrap md:flex-row items-center overflow-hidden">
      
      <CarouselProvider
        qtyCarousels={3} 
        carouselConfigs={carouselOptions}
      >
      {/* Carrusel Principal */}

        <div className="w-full h-[328px] md:flex md:justify-center md:absolute md:inset-0 md:w-full md:h-full z-0 bg-black md:transparent">
          <CarouselComponent carouselIndex={0}>
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet="https://images.ctfassets.net/lx4ov5kud2ld/6s6jeJMLjDziXIwLUM4l4R/0051032dbb49482f757e90be911951c1/home-tv-background_desktop_.webp"
              />
              <Image
                src="https://images.ctfassets.net/lx4ov5kud2ld/FFVdnIAhwHjkfDM2c7aMF/520903fad9d097ddf12027d0da3b7b92/home-tv-background_mobile_.webp"
                alt="Sky Sports Banner"
                className="
                  select-none pointer-events-none
                   transition-all
                  w-full h-full md:h-[560px]
                "
                priority
                width={402}
                height={328}
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </picture>
          </CarouselComponent>
        </div>

        {/* Contenido textual */}
          <CarouselComponent carouselIndex={2}>
              <div className="relative z-20 w-full pl-4 pr-4 md:w-2/5 px-4 pt-12 pb-6 md:px-8 md:py-12 flex flex-col gap-5 items-center md:items-start bg-black md:bg-transparent">

              <p className="uppercase ml-4 md:ml-0 text-sm text-gray-400 mb-2 tracking-widest w-screen md:w-auto">canales</p>
              <h2 className="text-3xl ml-4 md:ml-0 md:text-4xl font-bold text-white mb-4 w-screen md:w-auto">Sky sports</h2>
              <p className="text-base ml-4 md:ml-0 pr-4 md:pr-auto text-gray-300 mb-6 w-screen md:w-auto">
                Amplia variedad de contenido deportivo en alta definición, con programación exclusiva y en vivo para que no te pierdas ni un solo minuto de tus deportes favoritos.
              </p>
              <ButtonGhost classStyles="border-gray-400 text-white hover:!bg-white hover:!text-black sm:max-w-[320px] max-w-[256px] w-full h-[48px] rounded-md"
                          text="contratar ahora " />
              </div>
          </CarouselComponent>
      
      
        <div className="w-full self-end z-5">

          {/* Carousel de canales */}

          <div className="flex justify-center items-center w-full bg-black md:bg-transparent md:w-2/5 mx-auto h-[80px] md:h-[60px]">
              <CarouselThumbnailComponent targetCarouselIndex={0} syncAllCarousels={true}>
                  {thumbnailData.map((item, index) => (
                  <Image 
                    key={index}
                    width={88} 
                    height={56} 
                    src={item.src} 
                    alt={item.alt} 
                    className="" 
                  />
                ))}              
                </CarouselThumbnailComponent>
          </div>
          

          {/* Footer de logos */}
            <CarouselComponent carouselIndex={1}>
              <div className="
                w-full 
                bg-(--color-gray-450) p-4 border-t border-neutral-700
                h-[128px] md:h-[120px]
              ">
                <p className="text-xs w-full mb-2 text-gray-400 mr-4 min-w-max">
                  Disfruta de estos canales incluidos al contratar Sky sports
                </p>
                <div className=" grid grid-flow-col auto-cols-[88px] scroll-smooth snap-mandatory  gap-0.5 items-center overflow-x-auto scrollbar-hide">
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="LaLiga" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="Ligue1" className="mix-blend-screen" />

                </div>
                
                {/* ...otros logos */}
                
              </div>
            </CarouselComponent>
        </div>
      </CarouselProvider>
    </section>
  )
}

export default ChannelPromoBannerComponent
