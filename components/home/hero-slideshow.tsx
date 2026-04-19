"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  overlayFrom: string; // e.g. "rgba(10,15,40,0.85)"
  overlayTo: string;   // e.g. "rgba(10,15,40,0.4)"
  cta: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  interval?: number; // ms, default 5500
};

export function HeroSlideshow({ slides, interval = 5500 }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      const next = ((index % total) + total) % total;
      setIsAnimating(true);
      setCurrent(next);
      setTimeout(() => setIsAnimating(false), 900);
    },
    [isAnimating, total],
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => ((c + 1) % total));
    }, interval);
  }, [interval, total]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleNav = useCallback(
    (index: number) => {
      goTo(index);
      startTimer();
    },
    [goTo, startTimer],
  );

  const showPrevious = useCallback(() => {
    handleNav(current - 1);
  }, [current, handleNav]);

  const showNext = useCallback(() => {
    handleNav(current + 1);
  }, [current, handleNav]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showNext, showPrevious]);

  const slide = slides[current];

  return (
    <section
      className="relative h-[620px] overflow-hidden lg:h-[680px]"
      aria-label="Hero slideshow"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
        stopTimer();
      }}
      onTouchEnd={(event) => {
        const endX = event.changedTouches[0]?.clientX ?? null;
        if (touchStartX.current === null || endX === null) {
          startTimer();
          return;
        }

        const delta = touchStartX.current - endX;
        if (Math.abs(delta) > 40) {
          if (delta > 0) {
            showNext();
          } else {
            showPrevious();
          }
        } else {
          startTimer();
        }

        touchStartX.current = null;
      }}
    >
      {/* Background images — all mounted, only active one is visible */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className={`object-cover transition-transform duration-[8000ms] ease-out ${
              i === current ? "scale-[1.06]" : "scale-100"
            }`}
            priority={i === 0}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(105deg, ${s.overlayFrom} 0%, ${s.overlayTo} 55%, transparent 100%)`,
            }}
          />
        </div>
      ))}

      {/* Slide content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div
          key={slide.id}
          className="max-w-2xl space-y-5 px-6 lg:px-16 animate-hero-in"
        >
          <span className="inline-block rounded-full border border-brand-gold/40 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
            {slide.eyebrow}
          </span>
          <h1 className="font-heading text-4xl font-bold leading-[1.18] text-white drop-shadow-md lg:text-5xl xl:text-[3.2rem]">
            {slide.heading}
          </h1>
          <p className="max-w-[500px] text-base font-light leading-[1.8] text-white/85">
            {slide.body}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={slide.cta.primary.href}
              className="rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-brand-ink shadow-[0_4px_16px_rgba(245,197,24,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(245,197,24,0.5)]"
            >
              {slide.cta.primary.label}
            </Link>
            {slide.cta.secondary && (
              <Link
                href={slide.cta.secondary.href}
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {slide.cta.secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleNav(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === current
                ? "w-10 bg-brand-gold"
                : "w-6 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <div className="absolute bottom-6 right-6 z-30 flex gap-2 lg:right-10">
        <button
          onClick={showPrevious}
          aria-label="Previous slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
        >
          ←
        </button>
        <button
          onClick={showNext}
          aria-label="Next slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
        >
          →
        </button>
      </div>

      {/* Slide counter */}
      <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
          <span className="text-brand-gold">{String(current + 1).padStart(2, "0")}</span>
          {" / "}
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
