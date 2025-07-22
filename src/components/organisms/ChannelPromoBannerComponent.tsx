
import Image from "next/image"
import ButtonGhost from '../atoms/ButtonGhost';
import CarouselComponent from "../molecules/CarouselComponent";
import CarouselThumbnailComponent from "../molecules/CarouselThumbnailComponent";
import { CarouselProvider } from "@/utils/CarouselProvider";
import { EmblaOptionsType } from 'embla-carousel';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import { contentfulClient } from "@/services/contentful/client";
import { footerImageType, heroImageType } from "@/types/ChannelPromoBannerTypes";
import { ChannelPromoBannerProps } from "@/types/CarouselTypes";



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
    btnShowMore?: string; // Nueva propiedad opcional para el botón "Ver más"
    textPromo?: string; // Nueva propiedad opcional para el texto promocional
  }[] = [];



const ChannelPromoBannerComponent = async({id}:ChannelPromoBannerProps) => {

  // Opciones de configuración para los carruseles
  const carouselOptions = [
          {options: {dragFree:false, watchDrag: false, watchSlides: false, watchResize: true}, plugins: ['autoheight', 'autoplay']}, // Carrusel de imágenes (default)
          {options: {dragFree:false, watchDrag: false, watchSlides: false, watchResize: true}, plugins: ['fade', 'autoplay', 'autoheight']}, // Carrusel de logos (default)  
          { options: { dragFree:false, watchDrag: false, watchSlides: false, watchResize: true, breakpoints: {
            '(max-width: 420px)': { containScroll: false, slidesToScroll: 1},
          } }, plugins: [ 'fade' , 'autoheight', 'autoplay'] } // Carrusel de texto con fade
   ] as { options?: EmblaOptionsType, plugins?: string[] }[]

  // Consumo de la API de Contentful para obtener los datos de los canales

  // Obtener las entries por content type id

 const entriesChannels:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
    content_type: "carouselChannelsModel",
    'sys.id': id,
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
      btnShowMore: typeof text.fields.btnShowMore === "string" ? text.fields.btnShowMore : undefined,
      textPromo: typeof text.fields.textPromo === "string" ? text.fields.textPromo : undefined,
      urlBtnPromo: typeof text.fields.urlBtnPromo === "string" ? text.fields.urlBtnPromo : undefined
    }));
  }

  // Carrusel de los thumbnails

    const thumbnailsCarousel = entriesChannels?.[0]?.fields.thumbnailsCarousel as Entry<EntrySkeletonType, undefined, string>;
    if(Array.isArray(thumbnailsCarousel?.fields?.images) && thumbnailsCarousel.fields.images.length > 0) {
      thumbnailImages = (thumbnailsCarousel.fields.images as Asset[])
    ?.map((img:Asset) => ({
      url: 'https:' + img?.fields?.file?.url,
    })) || [];
  }

//Datos para carrusel del footer
const footerCarruselField = entriesChannels?.[0]?.fields?.footerCarrusel;
const footerIndexMapping: { [key: number]: number } = {};

if (Array.isArray(footerCarruselField) && footerCarruselField.length > 0) {
  
  // Crear un array combinando las imágenes con sus leyendas
  footerImages = footerCarruselField.map((footerItem, index) => {
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
        legend: (footerEntry?.fields?.legendFooter as string) || null,
        originalIndex: index
        // Asumiendo que tienes un campo slideIndex en tu CMS
      };
    }
    
    return {
      images: [],
      legend: (footerEntry?.fields?.legendFooter as string) || null,
      originalIndex: (footerEntry?.fields?.slideIndex as number) || 0
    };
  });

  // Crear el mapeo de índices
  footerImages.forEach((footerItem, footerIndex) => {
    footerIndexMapping[footerItem.originalIndex] = footerIndex;
  });
}

const getFooterDataForSlide = (currentSlideIndex: number) => {
  return footerImages[currentSlideIndex] || null;
};
      
  return (
    <section className="relative min-h-[740px]  md:h-full flex flex-col md:flex-wrap md:flex-row items-center overflow-hidden">
      
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
                  alt={`Banner ${index + 1}`}
                  className="select-none pointer-events-none transition-all w-full h-full md:h-[590px]"
                  loading="eager"
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
              <div key={index} style={{height: '-webkit-fill-available'}} className="relative z-20 w-full pt-[56px] md:pt-0 2xl:ml-[200px] md:ml-[80px] pb-10
                 md:w-2/5 flex flex-col items-center md:items-start bg-black md:bg-transparent">
                
                <p className="pl-4 md:pl-0 text-sm text-(--color-gray-200) leading-6 text-[16px] md:text-[18px] mb-6  w-screen md:w-auto">{item.channelType}</p>
                <h2 className="text-[32px] md:text-4xl pl-4 md:pl-0  font-bold text-white mb-6 w-screen md:w-auto">{item.title}</h2>
                <p className="text-[16px] md:text-[18px] leading-6 text-(--color-gray-200) pl-4 md:pl-0 pr-4 md:pr-auto mb-6 md:mb-10 w-screen md:w-auto">
                  {item.description}
                </p>

                {
                  item.textPromo && (
                    <p className="text-[16px] font-bold md:text-[18px] leading-6 text-(--color--turquoise-450) pl-4 md:pl-0 pr-4 md:pr-auto mb-8 md:mb-6 w-screen md:w-auto">
                      {item.textPromo}
                    </p>
                  )
                }

                <ButtonGhost classStyles=" border-white text-white text-[16px] md:text-[18px] leading-6 font-bold sm:max-w-[320px] max-w-[224px] w-full h-[48px] rounded-md"
                            text={item.buttonText} href={item.buttonLink} />
                            
                {
                  item.btnShowMore && (
                    <ButtonGhost classStyles="mt-4 border-black bg-white text-black font-bold text-[16px] md:text-[18px] leading-6 sm:max-w-[320px] max-w-[224px] w-full h-[48px] rounded-md"
                            text={item.btnShowMore} href={item.buttonLink} />
                  )
                }

              </div>
              ))}
          </CarouselComponent>
      
      
        <div className="w-full self-end z-5 bg-black md:bg-transparent">

          {/* Carousel de canales */}

          <div className="flex items-center w-full justify-center sm:justify-normal mx-auto xl:mx-0 2xl:pl-[225px] md:pl-[80px] md:pr-[80px] h-[80px] md:h-[60px] bg-black">
              <CarouselThumbnailComponent targetCarouselIndex={0} syncAllCarousels={true}>
                  {thumbnailImages.map((item, index) => (
                <div key={index} className="relative">
                  <Image 
                    width={88} 
                    height={40} 
                    src={item.url} 
                    alt={`Imagen del carrusel ${index + 1}`} 
                    className="min-w-max"
                    loading="eager"
                  />
                  {carouselText[index]?.textPromo && (
                    <span
                      className="
                        absolute md:-top-2.5 -top-4.5 right-0
                        w-5 h-5
                        bg-(--color--turquoise-450)
                        rounded-bl-[6px]
                        flex items-center justify-center
                        text-white text-sm
                        shadow-md"> % </span>
                  )}
                </div>

                ))}              
                </CarouselThumbnailComponent>
          </div>
          

          {/* Footer de logos */}
            <CarouselComponent carouselIndex={1}>
            {heroImages.map((_, heroIndex) => {
              const footerData = getFooterDataForSlide(heroIndex);
              
              return footerData ? (
                <div className="
                  w-full xl:pl-[225px] md:pl-[100px] pl-[50px]
                  bg-(--color-gray-450) p-4
                " key={heroIndex}>
                  <p className="w-full text-(--color-gray-200) text-[16px] leading-6 mb-2">
                    {footerData.legend ? footerData.legend : `Carrusel de Logos`}
                  </p>
                  <div className=" grid grid-flow-col auto-cols-[88px] scroll-smooth snap-mandatory mb-4 gap-0.5 items-center overflow-x-auto scrollbar-hide">
                    {footerData.images.map((image, imgIndex) => (
                      <Image 
                        key={imgIndex}
                        width={88} 
                        height={40} 
                        src={image.url} 
                        alt={`Logo del footer ${heroIndex + 1}-${imgIndex + 1}`}  
                        loading="eager"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Slide vacío para mantener la sincronización
                <div key={heroIndex} className="w-full h-0 hidden"></div>
              );
            })}
          </CarouselComponent>
        </div>
      </CarouselProvider>
    </section>
  )
}

export default ChannelPromoBannerComponent
