"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { ChannelPromoSlide } from "@/types/ChannelPromoTypes";

type Props = {
  slides: ChannelPromoSlide[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ThumbnailsBar({
  slides,
  currentIndex,
  onSelect,
  onPrev,
  onNext,
}: Props) {
  const canPrev = slides.length > 1;
  const canNext = slides.length > 1;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const selected = selectedRef.current;
    if (!container || !selected) return;
    const containerRect = container.getBoundingClientRect();
    const selectedRect = selected.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      (selectedRect.left - containerRect.left) -
      containerRect.width / 2 +
      selectedRect.width / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [currentIndex]);

  return (
    <div className="w-full flex-shrink-0 z-[5] order-first overflow-visible bg-transparent">
      <div className="flex items-center w-full min-w-0 justify-start mx-auto px-4 sm:px-8 md:pl-[120px] md:pr-[120px] h-[48px] sm:h-[64px] md:h-[60px] md:bg-transparent">
        <div className="relative w-full min-w-0 flex items-center gap-2">
          {canPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Anterior"
              className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-12 flex items-center justify-center cursor-pointer  hover:opacity-80"
            >
              <Image
                src="/images/arrow.svg"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 md:w-6 md:h-6 -rotate-90"
              />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex-1 relative overflow-x-auto overflow-y-visible flex items-center gap-2 md:gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-12 pr-12 md:pl-14 md:pr-14 py-1"
          >
            {slides.map((slide, slideIndex) => {
              if (!slide.logoUrl) return null;
              const isSelected = slideIndex === currentIndex;
              return (
                <button
                  key={slideIndex}
                  ref={isSelected ? selectedRef : undefined}
                  type="button"
                  onClick={() => onSelect(slideIndex)}
                  className={`relative w-[90px] h-[44px] min-w-[90px] min-h-[44px] sm:w-[100px] sm:h-[50px] sm:min-w-[100px] sm:min-h-[50px] md:w-[125px] md:h-[60px] md:min-w-[125px] md:min-h-[60px] cursor-pointer flex items-center justify-center shrink-0 overflow-visible snap-center px-1 border-b-4 transition-colors ${isSelected ? "border-white hover:opacity-100" : "border-transparent opacity-60 hover:opacity-80"}`}
                >
                  <Image
                    src={slide.logoUrl!}
                    alt={slide.title ?? "Logo"}
                    width={125}
                    height={76}
                    className="object-contain max-w-[80px] max-h-[30px]"
                    loading="eager"
                  />
                  {slide.textPromo && (
                    <span className="absolute right-0 top-0 z-20 min-w-[22px] h-[22px] md:min-w-[26px] md:h-[26px] px-1 bg-white rounded-b-[4px] flex items-center justify-center text-black text-[10px] md:text-sm font-bold shadow-md ring-2 ring-black/20">
                      %
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            className="absolute bottom-0 left-12 right-14 md:left-14 md:right-16 h-[2px] bg-white/10 pointer-events-none"
            aria-hidden
          />

          {canNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="Siguiente"
              className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-12 flex items-center justify-center cursor-pointer text-white hover:opacity-80"
            >
              <Image
                src="/images/arrow.svg"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 md:w-6 md:h-6 rotate-90"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
