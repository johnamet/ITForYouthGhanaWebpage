"use client";

import { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  overlayFrom: string; // e.g. "rgba(10,15,40,0.85)"
  overlayTo: string;   // e.g. "rgba(10,15,40,0.35)"
  cta: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  interval?: number;       // ms, default 6000
  featuredPanel?: ReactNode; // Optional right-side panel
};

export function HeroSlideshow({ slides, interval = 6000, featuredPanel }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      const next = ((index % total) + total) % total;
      setIsAnimating(true);
      setCurrent(next);
      setProgress(0);
      setTimeout(() => setIsAnimating(false), 1000);
    },
    [isAnimating, total]
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
      setProgress(0);
    }, interval);

    const step = 100 / (interval / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, 50);
  }, [interval, total]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    timerRef.current = null;
    progressRef.current = null;
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const handleNav = useCallback(
    (index: number) => {
      goTo(index);
      startTimer();
    },
    [goTo, startTimer]
  );

  const showPrevious = useCallback(() => handleNav(current - 1), [current, handleNav]);
  const showNext = useCallback(() => handleNav(current + 1), [current, handleNav]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPrevious, showNext]);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 80, behavior: "smooth" });
  };

  const slide = slides[current];

  return (
    <section
      className="relative h-screen min-h-[700px] overflow-hidden"
      aria-label="Hero slideshow"
      onMouseEnter={() => { setIsHovered(true); stopTimer(); }}
      onMouseLeave={() => { setIsHovered(false); startTimer(); }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
        stopTimer();
      }}
      onTouchEnd={(e) => {
        const endX = e.changedTouches[0]?.clientX ?? null;
        if (touchStartX.current === null || endX === null) { startTimer(); return; }
        const delta = touchStartX.current - endX;
        if (Math.abs(delta) > 50) {
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
      {/* ── Background Slides ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== current}
        >
          {/* Ken Burns */}
          <Image
            src={s.image}
            alt=""
            fill
            className={`object-cover transition-transform duration-[10000ms] ease-out ${
              i === current ? "scale-100" : "scale-110"
            }`}
            priority={i === 0}
            quality={90}
            sizes="100vw"
          />

          {/* Dynamic directional overlay from slide data */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(105deg, ${s.overlayFrom} 0%, ${s.overlayTo} 50%, rgba(0,0,0,0.25) 100%)`,
            }}
          />
          {/* Fixed structural overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/40 to-gray-900/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/30" />
        </div>
      ))}

      {/* ── Decorative Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-[15%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/4 left-[10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] animate-float-slow-reverse" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-[80px] animate-pulse-slow" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02] hero-grid-pattern" />
      </div>

      {/* ── Slide Content ── */}
      <div className="absolute inset-0 z-10 flex items-center pt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className={`grid gap-8 lg:gap-12 items-center ${featuredPanel ? "lg:grid-cols-12" : ""}`}>

            {/* Left — main content */}
            <div className={featuredPanel ? "lg:col-span-7 xl:col-span-6 mt-8 lg:mt-0" : "max-w-2xl"}>

              {/* Eyebrow badge */}
              <div key={`eyebrow-${current}`} className="inline-flex items-center gap-3 mb-8 animate-fade-in-up-delay-1">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold" />
                  </span>
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/90">
                    {slide.eyebrow}
                  </span>
                </div>
              </div>

              {/* Heading with gradient underline on last word cluster */}
              <div key={`heading-${current}`} className="space-y-2 mb-8 animate-fade-in-up-delay-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                  {(() => {
                    const words = slide.heading.split(" ");
                    const mid = Math.ceil(words.length / 2);
                    const first = words.slice(0, mid).join(" ");
                    const second = words.slice(mid).join(" ");
                    return (
                      <>
                        <span className="block">{first}</span>
                        <span className="block mt-2">
                          <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold bg-clip-text text-transparent">
                              {second}
                            </span>
                            {/* Gradient underline */}
                            <svg
                              className="absolute -bottom-1 md:-bottom-2 left-0 w-full"
                              height="12"
                              viewBox="0 0 200 12"
                              fill="none"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M2 8C50 3 150 3 198 8"
                                stroke={`url(#ug-${current})`}
                                strokeWidth="4"
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id={`ug-${current}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#f5c518" />
                                  <stop offset="50%" stopColor="#fde68a" />
                                  <stop offset="100%" stopColor="#f5c518" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </span>
                        </span>
                      </>
                    );
                  })()}
                </h1>
              </div>

              {/* Body */}
              <div key={`body-${current}`} className="animate-fade-in-up-delay-3">
                <p className="text-base sm:text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
                  {slide.body}
                </p>
              </div>

              {/* CTAs */}
              <div key={`cta-${current}`} className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-4">
                <Link
                  href={slide.cta.primary.href}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-brand-gold text-brand-ink shadow-2xl shadow-brand-gold/25 hover:shadow-brand-gold/40 hover:scale-[1.02] transition-all duration-300"
                >
                  {slide.cta.primary.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {slide.cta.secondary && (
                  <Link
                    href={slide.cta.secondary.href}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    {slide.cta.secondary.label}
                  </Link>
                )}
              </div>
            </div>

            {/* Right — optional featured panel */}
            {featuredPanel && (
              <div className="hidden lg:block lg:col-span-5 xl:col-span-6 animate-fade-in-up-delay-6">
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/20 via-yellow-300/10 to-brand-gold/20 rounded-3xl blur-2xl opacity-60" />
                  {/* Panel wrapper — consistent glass shell */}
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                    {featuredPanel}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Arrow Controls (hover-reveal, sides) ── */}
      <div
        className={`absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0 lg:opacity-60"
        }`}
      >
        <button
          onClick={showPrevious}
          aria-label="Previous slide"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div
        className={`absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0 lg:opacity-60"
        }`}
      >
        <button
          onClick={showNext}
          aria-label="Next slide"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ── Slide Progress Indicators (bottom-left pill style) ── */}
      <div className="absolute bottom-24 left-6 lg:left-12 z-20">
        <div className="flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleNav(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`relative h-1 rounded-full transition-all duration-500 ${
                index === current ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/50"
              }`}
            >
              {index === current && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold" />
              )}
            </button>
          ))}
          <span className="ml-4 text-sm text-gray-400 font-medium">
            <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
            <span className="mx-1">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </span>
        </div>
      </div>

      {/* ── Thin Progress Bar (bottom edge) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/10">
        <div
          className="h-full bg-brand-gold transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Vertical Slide Counter (desktop right) ── */}
      <div className="absolute right-6 top-1/2 z-40 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          <span className="text-brand-gold">{String(current + 1).padStart(2, "0")}</span>
          {" / "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ── Scroll Indicator ── */}
      <button
        onClick={scrollToContent}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 group cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 font-medium tracking-wider uppercase group-hover:text-white transition-colors">
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5 group-hover:border-white/50 transition-colors">
            <div className="w-1 h-2 bg-white rounded-full animate-scroll-indicator" />
          </div>
        </div>
      </button>

      {/* ── Bottom Gradient Fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-[5] pointer-events-none" />

      {/* ── Animations ── */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.8; }
        }
        @keyframes scroll-indicator {
          0%, 100% { transform: translateY(0);    opacity: 1; }
          50%       { transform: translateY(12px); opacity: 0.3; }
        }

        .hero-grid-pattern {
          background-image:
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .animate-fade-in-up-delay-1 { animation: fade-in-up 0.8s ease-out 0.1s both; }
        .animate-fade-in-up-delay-2 { animation: fade-in-up 0.8s ease-out 0.2s both; }
        .animate-fade-in-up-delay-3 { animation: fade-in-up 0.8s ease-out 0.3s both; }
        .animate-fade-in-up-delay-4 { animation: fade-in-up 0.8s ease-out 0.4s both; }
        .animate-fade-in-up-delay-6 { animation: fade-in-up 0.8s ease-out 0.6s both; }

        .animate-float-slow         { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slow-reverse { animation: float-slow-reverse 10s ease-in-out infinite; }
        .animate-pulse-slow         { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-scroll-indicator   { animation: scroll-indicator 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
