"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ChannelPromoData } from "@/types/ChannelPromoTypes";
import { ThumbnailsBar } from "./ThumbnailsBar";
import { HeroSlide } from "./HeroSlide";
import { TextPanel } from "./TextPanel";
import { PosterCarousel } from "./PosterCarousel";

const ROTATION_MS = 5000;
const AFTER_USER_SELECT_MS = 1111110000;
const CONTENT_FADE_MS = 250;
const BG_FADE_MS = 350;

type Props = {
  data: ChannelPromoData;
};

export function ChannelPromoView({ data }: Props) {
  const { slides } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeIndex = Math.min(
    Math.max(0, currentIndex),
    Math.max(0, slides.length - 1),
  );

  const [displayIndex, setDisplayIndex] = useState(safeIndex);
  const displayIndexRef = useRef(safeIndex);
  const [incomingBgIndex, setIncomingBgIndex] = useState<number | null>(null);
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    if (safeIndex === displayIndexRef.current) return;

    setIncomingBgIndex(safeIndex);
    setContentVisible(false);

    const contentTimer = setTimeout(() => {
      displayIndexRef.current = safeIndex;
      setDisplayIndex(safeIndex);
      setContentVisible(true);
    }, CONTENT_FADE_MS);

    const bgTimer = setTimeout(() => {
      setIncomingBgIndex(null);
    }, BG_FADE_MS);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(bgTimer);
    };
  }, [safeIndex]);

  const displaySlide = slides[displayIndex] ?? null;
  const incomingBgSlide = incomingBgIndex !== null ? (slides[incomingBgIndex] ?? null) : null;

  const goPrev = useCallback(() => {
    setCurrentIndex((i) =>
      slides.length > 1 ? (i <= 0 ? slides.length - 1 : i - 1) : i,
    );
  }, [slides.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) =>
      slides.length > 1 ? (i >= slides.length - 1 ? 0 : i + 1) : i,
    );
  }, [slides.length]);

  const startAutoRotation = useCallback(() => {
    if (slides.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i >= slides.length - 1 ? 0 : i + 1));
    }, ROTATION_MS);
  }, [slides.length]);

  const stopAndResumeAfterUser = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    restartTimeoutRef.current = setTimeout(() => {
      restartTimeoutRef.current = null;
      startAutoRotation();
    }, AFTER_USER_SELECT_MS);
  }, [startAutoRotation]);

  useEffect(() => {
    startAutoRotation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    };
  }, [startAutoRotation]);

  const onSelectUser = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      stopAndResumeAfterUser();
    },
    [stopAndResumeAfterUser],
  );

  const goPrevUser = useCallback(() => {
    goPrev();
    stopAndResumeAfterUser();
  }, [goPrev, stopAndResumeAfterUser]);

  const goNextUser = useCallback(() => {
    goNext();
    stopAndResumeAfterUser();
  }, [goNext, stopAndResumeAfterUser]);

  if (slides.length === 0) return null;

  return (
    <section className="relative z-0 h-full max-h-[100vh] max-md:h-auto max-md:min-h-0 max-md:max-h-none flex flex-col items-start overflow-x-hidden overflow-y-visible w-full max-w-full">
      <ThumbnailsBar
        slides={slides}
        currentIndex={safeIndex}
        onSelect={onSelectUser}
        onPrev={goPrevUser}
        onNext={goNextUser}
      />

      {displaySlide && <HeroSlide slide={displaySlide} />}

      {incomingBgIndex !== null && incomingBgSlide && (
        <div
          key={incomingBgIndex}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            zIndex: 1,
            animation: `channel-fade-in ${BG_FADE_MS}ms ease-in-out forwards`,
          }}
        >
          <HeroSlide slide={incomingBgSlide} />
        </div>
      )}

      <div
        className="flex flex-col md:grid md:grid-cols-[minmax(320px,1fr)_2fr] md:grid-rows-1 w-full max-w-full min-w-0 flex-1 min-h-0 md:min-h-[570px] md:h-[570px] gap-4 md:gap-8 max-md:gap-2 max-md:flex-none max-md:overflow-visible md:overflow-hidden"
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: `opacity ${CONTENT_FADE_MS}ms ease-in-out`,
        }}
      >
        <TextPanel slide={displaySlide} />
        {displaySlide?.posterImages && displaySlide.posterImages.length > 0 && (
          <PosterCarousel images={displaySlide.posterImages} />
        )}
      </div>
    </section>
  );
}
