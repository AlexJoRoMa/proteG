import { contentfulClient } from "./client";
import type { Entry, EntrySkeletonType } from "contentful";
import type { ChannelPromoData } from "@/types/ChannelPromoTypes";
import { mapContentfulToChannelPromo } from "@/lib/channels/channel-promo-mapper";

export async function getChannelPromoById(
  id: string,
): Promise<ChannelPromoData> {
  const { items } = await contentfulClient.getEntries<EntrySkeletonType>({
    content_type: "carouselChannelsModel",
    "sys.id": id,
    select: ["fields.carouselText"],
    include: 2,
  });

  const entry = items[0];
  if (!entry) return { slides: [] };

  return mapContentfulToChannelPromo(
    entry as Entry<EntrySkeletonType, undefined, string>,
  );
}
