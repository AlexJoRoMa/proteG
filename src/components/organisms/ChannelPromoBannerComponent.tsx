import Image from "next/image"
import ButtonGhost from '../atoms/ButtonGhost';


const ChannelPromoBannerComponent = () => {
  return (
    <section className="relative min-h-[740px] max-h-[908px] h-full flex flex-col flex-wrap md:flex-row items-center overflow-hidden">
      
      {/* Imagen absoluta y responsive */}
      <div className="w-full h-[328px] md:flex md:justify-center md:absolute md:inset-0 md:w-full md:h-full z-0 bg-black md:transparent">
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
              w-full h-full
            "
            priority
            width={402}
            height={328}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </picture>
      </div>

      {/* Contenido textual */}
      <div className="relative z-20 w-full md:w-2/5 px-4 pt-12 pb-6 md:px-8 md:py-12 flex flex-col gap-5 items-center md:items-start bg-black md:bg-transparent">
        <p className="uppercase text-sm text-gray-400 mb-2 tracking-widest w-full md:w-auto">canales</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 w-full md:w-auto">Sky sports</h2>
        <p className="text-base text-gray-300 mb-6 w-full md:w-auto">
          Amplia variedad de contenido deportivo en alta definición, con programación exclusiva y en vivo para que no te pierdas ni un solo minuto de tus deportes favoritos.
        </p>
        <ButtonGhost classStyles="border-gray-400 text-white hover:!bg-white hover:!text-black sm:max-w-[320px] max-w-[256px] w-full h-[48px] rounded-md"
                     text="contratar ahora " />
      </div>

      {/* Footer de logos */}
      <div className="
        flex flex-wrap w-full 
        bg-(--color-gray-450) p-4 items-center gap-3 border-t border-neutral-700 z-30 
        overflow-x-auto whitespace-nowrap self-end
      ">
        <span className="text-xs text-gray-400 mr-4 min-w-max">
          Disfruta de estos canales incluidos al contratar Sky sports
        </span>
        <Image width={41} height={24} src="https://upload.wikimedia.org/wikipedia/commons/3/3e/LaLiga_logo.png" alt="LaLiga" className="h-6 inline" />
        <Image width={41} height={24} src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Logo_Ligue1.png" alt="Ligue1" className="h-6 inline" />
        {/* ...otros logos */}
      </div>
    </section>
  )
}

export default ChannelPromoBannerComponent
