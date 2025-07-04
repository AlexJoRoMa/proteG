
import Image from "next/image"
import ButtonGhost from '../atoms/ButtonGhost';
import CarouselComponent from "../molecules/CarouselComponent";
import CarouselThumbnailComponent from "../molecules/CarouselThumbnailComponent";
import { CarouselProvider } from "@/utils/CarouselProvider";
import { EmblaOptionsType } from 'embla-carousel';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import { contentfulClient } from "@/services/contentful/client";

type heroImageType = {
  url: string;
  legend?: string;
}

type footerImageType = {
  images: { url: string }[];
  legend: string | null;
}

let heroImages: heroImageType[] = [];
let thumbnailImages: heroImageType[] = [];
let heroImagesResponsive: heroImageType[] = [];
let footerImages: footerImageType[] = [];
let carouselText: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    channelType: string;
  }[] = [];

const ChannelPromoBannerComponent = async() => {

  const carouselOptions = [
          {options: {dragFree:false, watchDrag: false, watchSlides: false, watchResize: true}, plugins: ['autoheight']}, // Carrusel de imágenes (default)
          {options: {dragFree:false, watchDrag: false, watchSlides: false, watchResize: true}, plugins: ['fade']}, // Carrusel de logos (default)  
          { options: { breakpoints: {
            '(max-width: 420px)': { containScroll: false, slidesToScroll: 1},
          } }, plugins: [ 'fade' , 'autoheight'] } // Carrusel de texto con fade
   ] as { options?: EmblaOptionsType, plugins?: string[] }[]

  // Consumo de la API de Contentful para obtener los datos de los canales

  // Obtener las entries por content type id

 const entriesChannels:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
    content_type: "carouselChannelsModel",
    select: ['fields.heroCarousel', 'fields.carouselText', 'fields.thumbnailsCarousel', 'fields.footerCarrusel']
  }).then((entriesResponse) => {
    return entriesResponse.items
  })

  //Obtener las imagenes del hero carousel

  const heroCarousel = entriesChannels?.[0]?.fields.heroCarousel as Entry<EntrySkeletonType, undefined, string>;
  if(heroCarousel?.fields?.images && Array.isArray(heroCarousel.fields.images) && heroCarousel.fields.images.length > 0 && heroCarousel?.fields?.responsiveImages && Array.isArray(heroCarousel.fields.responsiveImages) && heroCarousel.fields.responsiveImages.length > 0) {
      heroImages = (heroCarousel.fields.images as Asset[])
    ?.map((img:Asset) => ({
      url: 'https:' + img?.fields?.file?.url,
    })) || [];
      heroImagesResponsive = (heroCarousel.fields.responsiveImages as Asset[])
    ?.map((img:Asset) => ({
      url: 'https:' + img?.fields?.file?.url,
    })) || [];
  }

  //Obtener el carousel de textos

  const carouselTextRaw = entriesChannels?.[0]?.fields.carouselText;
  if (Array.isArray(carouselTextRaw)) {
    carouselText = (carouselTextRaw as Entry<EntrySkeletonType, undefined, string>[]).map((text) => ({
      title: typeof text.fields.title === "string" ? text.fields.title : "",
      description: typeof text.fields.description === "string" ? text.fields.description : "",
      buttonText: typeof text.fields.textBtn === "string" ? text.fields.textBtn : "",
      buttonLink: typeof text.fields.urlBtn === "string" ? text.fields.urlBtn : "",
      channelType: typeof text.fields.channelType === "string" ? text.fields.channelType : "",
    }));
  }

  // Datos de los thumbnails de los canales

    const thumbnailsCarousel = entriesChannels?.[0]?.fields.thumbnailsCarousel as Entry<EntrySkeletonType, undefined, string>;
    if(Array.isArray(thumbnailsCarousel?.fields?.images) && thumbnailsCarousel.fields.images.length > 0) {
      thumbnailImages = (thumbnailsCarousel.fields.images as Asset[])
    ?.map((img:Asset) => ({
      url: 'https:' + img?.fields?.file?.url,
    })) || [];
  }

  //Datos para carrusel del footer

const footerCarruselField = entriesChannels?.[0]?.fields?.footerCarrusel;
if (Array.isArray(footerCarruselField) && footerCarruselField.length > 0) {
  
  // Crear un array combinando las imágenes con sus leyendas
  footerImages = footerCarruselField.map((footerItem) => {
    const footerEntry = footerItem as Entry<EntrySkeletonType, undefined, string>;
    const carouselFooterRaw = footerEntry?.fields?.imageGrid;
    
    if (Array.isArray(carouselFooterRaw)) {
      // Crear el array de imágenes para este item
      const imageUrls = (carouselFooterRaw as Asset[]).map((img) => ({
        url: 'https:' + img?.fields?.file?.url,
      }));
      
      // Retornar un objeto con las imágenes y la leyenda
      return {
        images: imageUrls,
        legend: (footerEntry?.fields?.legendFooter as string) || null
      };
    }
    
    return {
      images: [],
      legend: (footerEntry?.fields?.legendFooter as string) || null
    };
  });
}
      
  return (
    <section className="relative min-h-[740px]  md:h-full flex flex-col md:flex-wrap md:flex-row items-center overflow-hidden w-">
      
      <CarouselProvider
        qtyCarousels={3} 
        carouselConfigs={carouselOptions}
      >
      {/* Carrusel Principal */}

        <div className="w-full md:flex md:justify-center md:absolute md:inset-0 md:w-full md:h-full z-0 bg-black md:transparent">
          <CarouselComponent carouselIndex={0}>

            {heroImages.map((image, index) => (
              <picture key={index}>
                <source
                  media="(min-width: 768px)"
                  srcSet={image.url}
                />
                <Image
                  src={heroImagesResponsive[index]?.url || image.url}
                  alt={`Sky Sports Banner ${index + 1}`}
                  className="select-none pointer-events-none transition-all w-full h-full md:h-[560px]"
                  priority
                  width={402}
                  height={328}
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </picture> 
            ))}
          </CarouselComponent>
        </div>

        {/* Contenido textual */}
        
          <CarouselComponent carouselIndex={2}>

              {carouselText.map((item, index) => (
              <div key={index} style={{height: '-webkit-fill-available'}} className="relative z-20 w-full pl-4
                pr-4 md:w-2/5 px-4 pt-12 pb-6 md:px-8 md:py-12 flex flex-col gap-5 items-center md:items-start bg-black md:bg-transparent">
                
                <p className="uppercase ml-4 md:ml-0 text-sm text-gray-400 mb-2 tracking-widest w-screen md:w-auto">{item.channelType}</p>
                <h2 className="text-3xl ml-4 md:ml-0 md:text-4xl font-bold text-white mb-4 w-screen md:w-auto">{item.title}</h2>
                <p className="text-base ml-4 md:ml-0 pr-4 md:pr-auto text-gray-300 mb-6 w-screen md:w-auto">
                  {item.description}
                </p>
                <ButtonGhost classStyles="border-gray-400 text-white hover:!bg-white hover:!text-black sm:max-w-[320px] max-w-[256px] w-full h-[48px] rounded-md"
                            text={item.buttonText} />
              </div>
              ))}
          </CarouselComponent>
      
      
        <div className="w-full self-end z-5">

          {/* Carousel de canales */}

          <div className="flex justify-center items-center w-full bg-black md:bg-transparent md:w-4/5 mx-auto h-[80px] md:h-[60px]">
              <CarouselThumbnailComponent targetCarouselIndex={0} syncAllCarousels={true}>
                  {thumbnailImages.map((item, index) => (
                  <Image 
                    key={index}
                    width={88} 
                    height={56} 
                    src={item.url} 
                    alt={`Imagen del carrusel ${index + 1}`} 
                    className=""
                    priority
                  />
                ))}              
                </CarouselThumbnailComponent>
          </div>
          

          {/* Footer de logos */}
            <CarouselComponent carouselIndex={1}>

       {footerImages.map((item, index) => (
              <div className="
                w-full 
                bg-(--color-gray-450) p-4 border-t border-neutral-700
                
              " key={index}>
                <p className="text-xs w-full mb-2 text-gray-400 mr-4 min-w-max">
                  {item.legend ? item.legend : `Carrusel de Logos`}
                </p>
                <div className=" grid grid-flow-col auto-cols-[88px] scroll-smooth snap-mandatory  gap-0.5 items-center overflow-x-auto scrollbar-hide">
                  {item.images.map((image, imgIndex) => (
                    <Image 
                      key={imgIndex}
                      width={88} 
                      height={40} 
                      src={image.url} 
                      alt={`Logo del footer ${index + 1}-${imgIndex + 1}`}  
                      className="mix-blend-screen"
                      priority
                    />
                  ))}
                </div>
              </div>
            ))}

              {/*<div className="
                w-full 
                bg-(--color-gray-450) p-4 border-t border-neutral-700
                h-[128px] md:h-[120px]
              ">
                <p className="text-xs w-full mb-2 text-gray-400 mr-4 min-w-max">
                  Disfruta de estos canales incluidos al contratar Sky sports
                </p>
                <div className=" grid grid-flow-col auto-cols-[88px] scroll-smooth snap-mandatory  gap-0.5 items-center overflow-x-auto scrollbar-hide">
                <Image width={88} height={40} src="https://images.ctfassets.net/lx4ov5kud2ld/3y7xgbMStEeKEIytDaLMdX/e882bd67627b220e9318a473bf2302e7/Universal_.webp" alt="LaLiga" className="mix-blend-screen" />
                </div>
                
              </div>*/}
            </CarouselComponent>
        </div>
      </CarouselProvider>
    </section>
  )
}

export default ChannelPromoBannerComponent
