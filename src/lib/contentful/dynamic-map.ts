import BenefitsComponent from "@/components/organisms/benefitsComponent";
import ChannelPromoBannerComponent from "@/components/organisms/ChannelPromoBannerComponent";
import PagesTabsTile from "@/components/organisms/pagesTabsTile";
import CarouselCardComponent from "@/components/organisms/CarouselCardComponent";
import GenericProductCard from "@/components/molecules/GenericProductComponent";
import ContratacionRapida from '@/components/organisms/contratacion-rapida';
import TodoEnUnoComp from '@/components/organisms/todo-uno';
import AccesoConfigurador from '@/components/organisms/acceso-configurador';
import CoberturaModel from '@/components/organisms/cobertura-model';
import TVBeneficiosProductos from '@/components/organisms/tv-beneficios-productos';
import BloqueSeparador from '@/components/organisms/bloque-separador';

export const componentMap = {
  carouselChannel: ChannelPromoBannerComponent,
  tabs: PagesTabsTile,
  homeCarousel: CarouselCardComponent,
  benefits: BenefitsComponent,
  carouselCards: CarouselCardComponent,
  cardTodoEnUno: TodoEnUnoComp,
  modeloAccesoConfigurador: AccesoConfigurador,
  cardCobertura: CoberturaModel,
  modelTvBeneficios: TVBeneficiosProductos,
  cardContainer: GenericProductCard,
  tvBloqueSeparador: BloqueSeparador,
  cardsContratacionRapida: ContratacionRapida
};