import React from "react";
import { contentfulClient } from "@/services/contentful/client";
import { Asset } from "contentful";
import { CardPropType } from "@/types/CarouselCardsTypes";
import DefaultCarouselCard from "../carouselCards/DefaultCarouselCard";
import FullMediaCarouselCard from "../carouselCards/FullMediaCarouselCard";

const CardHomeComponent = async ({ card, index = 0 }: CardPropType) => {
  const imageAsset = card?.fields?.image as Asset;
  const imageUrl = imageAsset?.sys?.id
    ? await contentfulClient.getEntry(imageAsset.sys.id).then((asset) => {
        return asset.fields;
      })
    : null;
  const mediaUrl = (imageUrl?.image as Asset)?.fields?.file?.url;
  const isVideo =
    typeof mediaUrl === "string" && mediaUrl.toLowerCase().endsWith(".mp4");
  const shouldPrioritize = index < 3;

  const cardWidth = card?.fields?.cardwidth;
  const validWidth =
    typeof cardWidth === "string" || typeof cardWidth === "number"
      ? cardWidth
      : undefined;
  const hasCustomWidth = validWidth != null && String(validWidth).trim() !== "";
  const widthStyle = hasCustomWidth ? { width: validWidth } : undefined;
  const parsedWidth = hasCustomWidth
    ? parseFloat(String(validWidth).replace(/[^\d.-]/g, ""))
    : 0;
  const useCompactPadding = hasCustomWidth && parsedWidth >= 900;

  return (
    <div
      className="h-[760px] 4xl:max-h-[985px] max-h-[850px] 4xl:h-[830px] xl:h-[985px] md:h-[785px] flex flex-col rounded-md relative overflow-hidden min-w-0 box-border p-0 m-0"
      style={widthStyle}
      {...(hasCustomWidth ? { "data-card-width": "true" } : {})}
    >
      {card?.fields?.tagPromotional ? (
        <div className=" rounded-t-md px-6 py-1 absolute top-0 text-[18px] leading-6 w-full text-center text-white bg-[image:var(--gradient-card-tag-home)]">
          {card.fields.tagPromotional as string}
        </div>
      ) : null}
      {card?.fields?.layoutStyle === "DEFAULT" ? (
        <DefaultCarouselCard
          imageSrc={mediaUrl ? `https:${mediaUrl}` : ""}
          imageAltText={(imageUrl?.altText as string) || "Imagen del Card"}
          shouldPrioritize={shouldPrioritize}
          card={card}
          isVideo={isVideo}
          useCompactPadding={useCompactPadding}
        />
      ) : (
        <FullMediaCarouselCard
          mediaSrc={mediaUrl ? `https:${mediaUrl}` : ""}
          imageAltText={(imageUrl?.altText as string) || "Imagen del Card"}
          shouldPrioritize={shouldPrioritize}
          card={card}
          isVideo={isVideo}
          useCompactPadding={useCompactPadding}
        />
      )}
    </div>
  );
};

export default CardHomeComponent;
