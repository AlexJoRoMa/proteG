"use client";

import Image from "next/image";
import type { ChannelPromoSlide } from "@/types/ChannelPromoTypes";

const DEFAULT_HERO_BG = "/images/channel-promo-bg-default.png";

type Props = { slide: ChannelPromoSlide };

export function HeroSlide({ slide }: Props) {
  const url = slide.imageBackground ?? slide.heroImageUrl ?? DEFAULT_HERO_BG;

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <Image
        src={url}
        alt=""
        fill
        className="select-none pointer-events-none object-cover object-center"
        sizes="100vw"
        priority
      />
    </div>
  );
}
