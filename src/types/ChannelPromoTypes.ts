export type ChannelPromoImage = {
  url: string;
  width?: number;
  height?: number;
};

export type ChannelPromoSlide = {
  logoUrl?: string;
  title?: string;
  description: string;
  textPromo?: string;
  btnShowMore?: string;
  showMoreUrl?: string;
  btnPrimaryCtaText?: string;
  primaryCtaUrl?: string;
  heroImageUrl?: string;
  imageBackground?: string;
  posterImages?: ChannelPromoImage[];
  footerImages?: ChannelPromoImage[];
  footerLegend?: string | null;
};

export type ChannelPromoData = {
  slides: ChannelPromoSlide[];
};
