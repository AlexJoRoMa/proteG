"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import type { ChannelPromoImage } from "@/types/ChannelPromoTypes";

type Props = {
  images: ChannelPromoImage[];
};

const SCROLL_AMOUNT = 281; // 265px poster + 16px gap
const EDGE_THRESHOLD = 2;

export function PosterCarousel({ images }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > EDGE_THRESHOLD);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE_THRESHOLD
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, images.length]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (canScrollRight) {
      el.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    } else {
      el.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  if (images.length === 0) return null;

  const showArrows = images.length > 4;

  return (
    <div className="z-10 relative w-full min-w-0 pr-0 pb-4 md:py-8 md:mt-1 min-h-[470px] md:min-h-0 md:h-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex items-center gap-3 md:gap-4 overflow-x-auto overflow-y-hidden h-full min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory -ml-4 pl-12 -mr-4 md:-mr-8"
      >
        {images.map((img, i) => (
          <button
            key={i}
            className="flex shrink-0 w-[265px] min-w-[265px] h-[470px] rounded-lg overflow-hidden"
          >
            <Image
              src={img.url}
              alt=""
              width={265}
              height={470}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {showArrows && (
        <div
          className={`absolute -left-4 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-[#060606] to-transparent pointer-events-none z-10 max-md:hidden transition-opacity duration-150 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
          aria-hidden
        />
      )}

      {showArrows && (
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-[#060606] to-transparent pointer-events-none z-10 max-md:hidden"
          aria-hidden
        />
      )}

      {showArrows && (
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Anterior"
          className={`absolute -left-4 md:-left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center max-md:hidden transition-opacity duration-150 ${canScrollLeft ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"}`}
        >
          <Image
            src="/images/arrow.svg"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 -rotate-90"
          />
        </button>
      )}

      {showArrows && (
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Siguiente"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center max-md:hidden cursor-pointer"
        >
          <Image
            src="/images/arrow.svg"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 rotate-90"
          />
        </button>
      )}
    </div>
  );
}
