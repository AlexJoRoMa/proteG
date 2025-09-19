import BenefitsComponent from "@/components/organisms/benefitsComponent";
import ChannelPromoBannerComponent from "@/components/organisms/ChannelPromoBannerComponent";
import Configurador from "@/components/organisms/configurador";
import PagesTabsTile from "@/components/organisms/pagesTabsTile";
import CarouselCardComponent from "@/components/organisms/CarouselCardComponent";
import GenericProductCard from "@/components/molecules/GenericProductComponent";
import ContratacionRapida from '@/components/organisms/contratacion-rapida';
import TodoEnUnoComp from '@/components/organisms/todo-uno';
import AccesoConfigurador from '@/components/organisms/acceso-configurador';
import CoberturaModel from '@/components/organisms/cobertura-model';
import Recomendador from "@/components/organisms/recomendador";
import TVBeneficiosProductos from '@/components/organisms/tv-beneficios-productos';
import BloqueSeparador from '@/components/organisms/bloque-separador';
import ConIzziTv from '@/components/organisms/tv-top-banner';
import IzziGoBloque from '@/components/organisms/tv-izzi-go';
import TVCanalesSegmento from '@/components/organisms/tv-canales-segmentos';

export const componentMap = {
  carouselChannel: ChannelPromoBannerComponent,
  tabs: PagesTabsTile,
  multyStepConfigurador: Configurador,
  homeCarousel: CarouselCardComponent,
  benefits: BenefitsComponent,
  carouselCards: CarouselCardComponent,
  cardTodoEnUno: TodoEnUnoComp,
  modeloAccesoConfigurador: AccesoConfigurador,
  cardCobertura: CoberturaModel,
  modelTvBeneficios: TVBeneficiosProductos,
  cardContainer: GenericProductCard,
  tvBloqueSeparador: BloqueSeparador,
  modelIzziTV: ConIzziTv,
  IzziGoBloque: IzziGoBloque,
  tabCanalesTV: TVCanalesSegmento,
  cardsContratacionRapida: ContratacionRapida,
  recomendador: Recomendador
};