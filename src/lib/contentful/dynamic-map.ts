import ChannelPromoBannerComponent from "@/components/organisms/ChannelPromoBannerComponent";
import PagesTabsTile from "@/components/organisms/pagesTabsTile";
import HomeCarouselCardComponent from "@/components/organisms/HomeCarouselCardComponent";
import ContratacionRapida from '@/components/organisms/contratacion-rapida';
import AccesoConfigurador from '@/components/organisms/acceso-configurador';

export const componentMap = {
  carouselChannel: ChannelPromoBannerComponent,
  tabs: PagesTabsTile,
  homeCarousel: HomeCarouselCardComponent,
  modeloAccesoConfigurador: AccesoConfigurador,
  cardsContratacionRapida: ContratacionRapida
};