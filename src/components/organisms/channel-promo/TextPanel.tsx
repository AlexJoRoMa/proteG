"use client";

import Image from "next/image";
import ButtonGhost from "@/components/atoms/ButtonGhost";
import type { ChannelPromoSlide } from "@/types/ChannelPromoTypes";

type Props = {
  slide: ChannelPromoSlide;
};

export function TextPanel({ slide }: Props) {
  return (
    <div className="z-10 min-w-0 w-full max-w-full px-4 sm:px-8 md:px-10 py-2 md:py-8 flex flex-col items-center justify-center text-center overflow-x-hidden flex-1 max-md:flex-none">
      <div className="flex flex-col items-center mb-3 md:mb-2 justify-center px-2 max-w-full md:max-w-[400px] max-h-[200px] md:max-h-[310px] w-full shrink-0">
        {slide.logoUrl && (
          <Image
            src={slide.logoUrl}
            alt={slide.title ?? "Logo"}
            width={150}
            height={150}
            className="object-contain max-w-[200px] max-h-[110px] pb-8"
          />
        )}
        {slide.textPromo && (
          <div className="bg-white/95 flex rounded-lg px-1 py-0.5 md:px-2 md:py-1 max-w-full border border-white/30 md:border-0">
            <span className="text-black text-sm md:text-base font-bold leading-6">
              {slide.textPromo}
            </span>
          </div>
        )}
      </div>

      <p className="text-[14px] mt-2 md:mt-0 md:text-[18px] mb-4 leading-6 text-center md:text-left text-white break-words w-full max-w-full md:max-w-[470px] px-2">
        {slide.description}
      </p>

      <div className="flex flex-col gap-4 mb-10 md:mb-0 md:gap-4 w-full max-w-full md:max-w-[400px] md:px-6 shrink-0">
        {slide.btnShowMore && slide.showMoreUrl && (
          <ButtonGhost
            classStyles="border border-white bg-transparent text-white text-[16px] md:text-[17px] leading-6 font-bold w-full py-6 rounded-lg hover:opacity-70"
            text={slide.btnShowMore}
            href={slide.showMoreUrl}
          />
        )}
        {slide.btnPrimaryCtaText && slide.primaryCtaUrl && (
          <ButtonGhost
            classStyles="border border-transparent bg-white text-black text-[16px] md:text-[17px] leading-6 font-bold w-full py-6 rounded-lg hover:opacity-70"
            text={slide.btnPrimaryCtaText}
            href={slide.primaryCtaUrl}
          />
        )}
      </div>
    </div>
  );
}
