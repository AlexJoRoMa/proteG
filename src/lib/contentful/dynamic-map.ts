import ChannelPromoBannerComponent from "@/components/organisms/ChannelPromoBannerComponent";
import PagesTabsTile from "@/components/organisms/pagesTabsTile";
import HomeCarouselCardComponent from "@/components/organisms/HomeCarouselCardComponent";
import ContratacionRapida from '@/components/organisms/contratacion-rapida';
import TodoEnUnoComp from '@/components/organisms/todo-uno';
import AccesoConfigurador from '@/components/organisms/acceso-configurador';
import CoberturaModel from '@/components/organisms/cobertura-model';
import ConIzziTv from '@/components/organisms/con-izzi-tv';

export const componentMap = {
  carouselChannel: ChannelPromoBannerComponent,
  tabs: PagesTabsTile,
  homeCarousel: HomeCarouselCardComponent,
  cardTodoEnUno: TodoEnUnoComp,
  modeloAccesoConfigurador: AccesoConfigurador,
  cardCobertura: CoberturaModel,
   modelIzziTV: ConIzziTv,
  cardsContratacionRapida: ContratacionRapida
};