import { getChannelPromoById } from "@/services/contentful/channels";
import { ChannelPromoBannerProps } from "@/types/CarouselTypes";
import { ChannelPromoView } from "./channel-promo";

export default async function ChannelPromoBannerComponent({
  id,
}: ChannelPromoBannerProps) {
  const data = await getChannelPromoById(id);
  return <ChannelPromoView data={data} />;
}
