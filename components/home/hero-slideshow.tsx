"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  image: string;

  /**
   * Colours used to give each editorial panel
   * a slightly different visual identity.
   *
   * Example:
   * overlayFrom: "rgba(10,15,40,0.98)"
   * overlayTo: "rgba(10,15,40,0.72)"
   */
  overlayFrom: string;
  overlayTo: string;

  cta: {
    primary: {
      label: string;
      href: string;
    };

    secondary?: {
      label: string;
      href: string;
    };
  };
};

type HeroSlideshowProps = {
  slides: HeroSlide[];

  /**
   * Time between slides in milliseconds.
   * Default: 6000
   */
  interval?: number;

  /**
   * Optional extra content displayed inside
   * the editorial panel.
   */
  featuredPanel?: ReactNode;
};

function splitHeading(heading: string) {
  const words = heading.trim().split(/\s+/);

  if (words.length <= 2) {
    return {
      first: heading,
      second: "",
    };
  }

  const splitPoint = Math.max(1, Math.ceil(words.length * 0.52));

  return {
    first: words.slice(0, splitPoint).join(" "),
    second: words.slice(splitPoint).join(" "),
  };
}

export function HeroSlideshow({
  slides,
  interval = 6000,
  featuredPanel,
}: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    timerRef.current = null;
    progressRef.current = null;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || total === 0) {
        return;
      }

      const next = ((index % total) + total) % total;

      if (next === current) {
        setProgress(0);
        return;
      }

      setIsAnimating(true);
      setCurrent(next);
      setProgress(0);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    },
    [current, isAnimating, total],
  );

  const startTimer = useCallback(() => {
    stopTimer();

    if (total <= 1) {
      setProgress(0);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrent((previous) => (previous + 1) % total);
      setProgress(0);
    }, interval);

    const refreshRate = 50;
    const progressStep = 100 / (interval / refreshRate);

    progressRef.current = setInterval(() => {
      setProgress((previous) =>
        Math.min(previous + progressStep, 100),
      );
    }, refreshRate);
  }, [interval, stopTimer, total]);

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

  /*
   * Start and clean up slideshow timers.
   */
  useEffect(() => {
    startTimer();

    return () => {
      stopTimer();

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [startTimer, stopTimer]);

  /*
   * Reset to the first slide if the slides array
   * becomes shorter during a re-render.
   */
  useEffect(() => {
    if (total > 0 && current >= total) {
      setCurrent(0);
      setProgress(0);
    }
  }, [current, total]);

  /*
   * Keyboard navigation.
   */
  useEffect(() => {
    if (total <= 1) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNext, showPrevious, total]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: "smooth",
    });
  };

  if (total === 0) {
    return null;
  }

  const slide = slides[current] ?? slides[0];
  const headingParts = splitHeading(slide.heading);

  return (
    <section
      className="
        relative
        h-[100svh]
        min-h-[760px]
        overflow-hidden
        bg-neutral-950
      "
      aria-label="Hero slideshow"
      onMouseEnter={() => {
        setIsHovered(true);
        stopTimer();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        startTimer();
      }}
      onTouchStart={(event) => {
        touchStartX.current =
          event.touches[0]?.clientX ?? null;

        stopTimer();
      }}
      onTouchEnd={(event) => {
        const endX =
          event.changedTouches[0]?.clientX ?? null;

        if (
          touchStartX.current === null ||
          endX === null
        ) {
          startTimer();
          return;
        }

        const delta =
          touchStartX.current - endX;

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
      <div
        className="
          absolute
          inset-0
          grid
          grid-rows-[45%_55%]
          lg:grid-cols-[minmax(0,1fr)_minmax(400px,38vw)]
          lg:grid-rows-1
        "
      >
        {/* ==================================================
            LEFT SIDE — FULL IMAGE
        ================================================== */}
        <div className="relative min-h-0 overflow-hidden bg-neutral-950">
          {/* Background slides */}
          {slides.map((item, index) => {
            const isActive = index === current;

            return (
              <div
                key={item.id}
                className={`
                  absolute
                  inset-0
                  transition-opacity
                  duration-1000
                  ease-out
                  ${
                    isActive
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }
                `}
                aria-hidden={!isActive}
              >
                {/*
                 * Blurred duplicate fills the empty spaces
                 * caused by object-contain.
                 */}
                <Image
                  src={item.image}
                  alt=""
                  fill
                  aria-hidden="true"
                  quality={45}
                  sizes="
                    (min-width: 1024px) 62vw,
                    100vw
                  "
                  className={`
                    object-cover
                    opacity-55
                    blur-3xl
                    transition-transform
                    duration-[10000ms]
                    ease-out
                    ${
                      isActive
                        ? "scale-110"
                        : "scale-125"
                    }
                  `}
                />

                {/* Dark treatment over blurred filler */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Decorative radial vignette */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.65)_100%)]
                  "
                />

                {/*
                 * Main image frame.
                 * object-contain guarantees that the entire
                 * photograph remains visible.
                 */}
                <div
                  className="
                    absolute
                    inset-0
                    px-3
                    pb-4
                    pt-20
                    sm:px-6
                    sm:pb-6
                    sm:pt-24
                    lg:px-10
                    lg:pb-10
                    lg:pt-24
                    xl:px-14
                  "
                >
                  <div
                    className="
                      relative
                      h-full
                      w-full
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-black/30
                      shadow-2xl
                      shadow-black/50
                      sm:rounded-[2rem]
                    "
                  >
                    <Image
                      src={item.image}
                      alt={item.heading}
                      fill
                      priority={index === 0}
                      quality={95}
                      sizes="
                        (min-width: 1024px) 62vw,
                        100vw
                      "
                      className={`
                        object-contain
                        transition-transform
                        duration-[10000ms]
                        ease-out
                        ${
                          isActive
                            ? "scale-100"
                            : "scale-[1.035]"
                        }
                      `}
                    />

                    {/* Very light image overlays */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-b
                        from-black/20
                        via-transparent
                        to-black/20
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        ring-1
                        ring-inset
                        ring-white/10
                      "
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Decorative atmosphere */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                animate-float-slow
                absolute
                -left-32
                top-1/4
                h-[380px]
                w-[380px]
                rounded-full
                bg-brand-gold/10
                blur-[110px]
              "
            />

            <div
              className="
                animate-float-slow-reverse
                absolute
                -right-24
                bottom-1/4
                h-[320px]
                w-[320px]
                rounded-full
                bg-white/5
                blur-[100px]
              "
            />

            <div
              className="
                hero-grid-pattern
                absolute
                inset-0
                opacity-[0.025]
              "
            />
          </div>

          {/* Previous slide button */}
          {total > 1 && (
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous slide"
              className={`
                group
                absolute
                left-4
                top-1/2
                z-30
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-black/35
                text-white
                shadow-xl
                backdrop-blur-xl
                transition-all
                duration-300
                hover:scale-110
                hover:border-white/40
                hover:bg-black/60
                sm:left-7
                sm:h-12
                sm:w-12
                lg:left-8
                ${
                  isHovered
                    ? "opacity-100"
                    : "opacity-60 lg:opacity-45"
                }
              `}
            >
              <ChevronLeft
                className="
                  h-5
                  w-5
                  transition-transform
                  group-hover:-translate-x-0.5
                  sm:h-6
                  sm:w-6
                "
              />
            </button>
          )}

          {/* Next slide button */}
          {total > 1 && (
            <button
              type="button"
              onClick={showNext}
              aria-label="Next slide"
              className={`
                group
                absolute
                right-4
                top-1/2
                z-30
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-black/35
                text-white
                shadow-xl
                backdrop-blur-xl
                transition-all
                duration-300
                hover:scale-110
                hover:border-white/40
                hover:bg-black/60
                sm:right-7
                sm:h-12
                sm:w-12
                lg:right-8
                ${
                  isHovered
                    ? "opacity-100"
                    : "opacity-60 lg:opacity-45"
                }
              `}
            >
              <ChevronRight
                className="
                  h-5
                  w-5
                  transition-transform
                  group-hover:translate-x-0.5
                  sm:h-6
                  sm:w-6
                "
              />
            </button>
          )}

          {/* Vertical slide counter */}
          {total > 1 && (
            <div
              className="
                absolute
                right-3
                top-1/2
                z-20
                hidden
                -translate-y-1/2
                lg:block
                [writing-mode:vertical-rl]
              "
            >
              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-white/45
                "
              >
                <span className="text-brand-gold">
                  {String(current + 1).padStart(2, "0")}
                </span>

                {" / "}

                {String(total).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Small image label */}
          <div
            className="
              absolute
              bottom-6
              left-1/2
              z-20
              hidden
              -translate-x-1/2
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-black/30
              px-4
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-white/60
              backdrop-blur-xl
              sm:flex
              lg:bottom-12
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-brand-gold
              "
            />

          </div>
        </div>

        {/* ==================================================
            RIGHT SIDE — EDITORIAL PANEL
        ================================================== */}
        <aside
          className="
            relative
            z-20
            min-h-0
            overflow-y-auto
            border-t
            border-white/10
            bg-gray-950
            lg:border-l
            lg:border-t-0
          "
          aria-live="polite"
        >
          {/* Dynamic panel background */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  145deg,
                  ${slide.overlayFrom} 0%,
                  ${slide.overlayTo} 48%,
                  rgba(3, 7, 18, 0.99) 100%
                )
              `,
            }}
          />

          {/* Panel texture */}
          <div
            className="
              hero-grid-pattern
              pointer-events-none
              absolute
              inset-0
              opacity-[0.025]
            "
          />

          {/* Panel lighting */}
          <div
            className="
              animate-pulse-slow
              pointer-events-none
              absolute
              -right-32
              top-20
              h-[420px]
              w-[420px]
              rounded-full
              bg-brand-gold/10
              blur-[130px]
            "
          />

          <div
            className="
              relative
              flex
              min-h-full
              flex-col
              px-6
              pb-10
              pt-7
              sm:px-9
              sm:pb-12
              sm:pt-9
              lg:px-10
              lg:pb-10
              lg:pt-24
              xl:px-14
            "
          >
            {/* Top metadata */}
            <div
              key={`metadata-${current}`}
              className="
                animate-fade-in-up-delay-1
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-white/15
                  bg-white/[0.06]
                  px-4
                  py-2
                  shadow-lg
                  backdrop-blur-xl
                "
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-brand-gold
                      opacity-70
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-2
                      w-2
                      rounded-full
                      bg-brand-gold
                    "
                  />
                </span>

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white/80
                    sm:text-xs
                  "
                >
                  {slide.eyebrow}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  tracking-[0.15em]
                  text-white/40
                "
              >
                <span className="text-white">
                  {String(current + 1).padStart(2, "0")}
                </span>

                <span>/</span>

                <span>
                  {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Editorial divider */}
            <div
              className="
                my-5
                h-px
                w-full
                bg-gradient-to-r
                from-brand-gold/70
                via-white/15
                to-transparent
                sm:my-7
              "
            />

            {/* Heading */}
            <div
              key={`heading-${current}`}
              className="animate-fade-in-up-delay-2"
            >
              <h1
                className="
                  text-3xl
                  font-bold
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-white
                  sm:text-4xl
                  md:text-5xl
                  lg:text-[clamp(2.8rem,4.3vw,5.2rem)]
                "
              >
                <span className="block">
                  {headingParts.first}
                </span>

                {headingParts.second && (
                  <span className="mt-2 block">
                    <span className="relative inline-block">
                      <span
                        className="
                          bg-gradient-to-r
                          from-brand-gold
                          via-yellow-200
                          to-brand-gold
                          bg-clip-text
                          text-transparent
                        "
                      >
                        {headingParts.second}
                      </span>

                      <svg
                        className="
                          absolute
                          -bottom-2
                          left-0
                          w-full
                        "
                        height="12"
                        viewBox="0 0 200 12"
                        fill="none"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 8C50 3 150 3 198 8"
                          stroke={`url(#editorial-underline-${current})`}
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        <defs>
                          <linearGradient
                            id={`editorial-underline-${current}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#f5c518"
                            />

                            <stop
                              offset="50%"
                              stopColor="#fde68a"
                            />

                            <stop
                              offset="100%"
                              stopColor="#f5c518"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </span>
                )}
              </h1>
            </div>

            {/* Body */}
            <div
              key={`body-${current}`}
              className="animate-fade-in-up-delay-3"
            >
              <p
                className="
                  mt-6
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/65
                  sm:text-base
                  sm:leading-8
                  lg:text-[1.05rem]
                "
              >
                {slide.body}
              </p>
            </div>

            {/* Calls to action */}
            <div
              key={`cta-${current}`}
              className="
                animate-fade-in-up-delay-4
                mt-7
                flex
                flex-col
                gap-3
                sm:flex-row
                lg:flex-col
                xl:flex-row
              "
            >
              <Link
                href={slide.cta.primary.href}
                className="
                  group
                  inline-flex
                  min-h-12
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-brand-gold
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-brand-ink
                  shadow-xl
                  shadow-brand-gold/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-2xl
                  hover:shadow-brand-gold/30
                "
              >
                {slide.cta.primary.label}

                <ArrowRight
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              {slide.cta.secondary && (
                <Link
                  href={slide.cta.secondary.href}
                  className="
                    inline-flex
                    min-h-12
                    flex-1
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/20
                    bg-white/[0.05]
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-white/40
                    hover:bg-white/10
                  "
                >
                  {slide.cta.secondary.label}
                </Link>
              )}
            </div>

            {/* Optional featured panel */}
            {featuredPanel && (
              <div
                key={`featured-${current}`}
                className="
                  animate-fade-in-up-delay-5
                  relative
                  mt-7
                "
              >
                <div
                  className="
                    absolute
                    -inset-2
                    rounded-3xl
                    bg-brand-gold/10
                    blur-xl
                  "
                />

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.055]
                    p-4
                    shadow-2xl
                    backdrop-blur-xl
                    sm:p-5
                  "
                >
                  {featuredPanel}
                </div>
              </div>
            )}

            {/* Bottom navigation area */}
            <div className="mt-auto pt-7 lg:pt-10">
              {/* Slide indicators */}
              {total > 1 && (
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-5
                    border-t
                    border-white/10
                    pt-6
                  "
                >
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2.5
                    "
                  >
                    {slides.map((item, index) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleNav(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={
                          index === current
                            ? "true"
                            : undefined
                        }
                        className={`
                          relative
                          h-1.5
                          overflow-hidden
                          rounded-full
                          transition-all
                          duration-500
                          ${
                            index === current
                              ? "w-12 bg-white/20"
                              : "w-5 bg-white/20 hover:bg-white/40"
                          }
                        `}
                      >
                        {index === current && (
                          <span
                            className="
                              absolute
                              inset-0
                              rounded-full
                              bg-gradient-to-r
                              from-brand-gold
                              via-yellow-200
                              to-brand-gold
                            "
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <span
                    className="
                      whitespace-nowrap
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-white/35
                    "
                  >
                    Use arrow keys
                  </span>
                </div>
              )}

              {/* Scroll control */}
              <button
                type="button"
                onClick={scrollToContent}
                aria-label="Scroll to the next section"
                className="
                  group
                  mt-5
                  inline-flex
                  items-center
                  gap-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/45
                  transition-colors
                  duration-300
                  hover:text-white
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    bg-white/[0.04]
                    transition-all
                    duration-300
                    group-hover:border-brand-gold/50
                    group-hover:bg-brand-gold/10
                  "
                >
                  <ArrowDown
                    className="
                      h-4
                      w-4
                      text-brand-gold
                      transition-transform
                      duration-300
                      group-hover:translate-y-0.5
                    "
                  />
                </span>

                Explore more
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ==================================================
          GLOBAL PROGRESS BAR
      ================================================== */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-40
          h-[3px]
          bg-white/10
        "
      >
        <div
          className="
            h-full
            bg-brand-gold
            transition-[width]
            duration-75
            ease-linear
          "
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* ==================================================
          ANIMATIONS
      ================================================== */}
      <style jsx global>{`
        @keyframes editorial-fade-in-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes editorial-float-slow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(20px, -20px) scale(1.05);
          }
        }

        @keyframes editorial-float-slow-reverse {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-20px, 20px) scale(1.05);
          }
        }

        @keyframes editorial-pulse-slow {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 0.8;
          }
        }

        .hero-grid-pattern {
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            );

          background-size: 50px 50px;
        }

        .animate-fade-in-up-delay-1 {
          animation:
            editorial-fade-in-up
            0.8s
            ease-out
            0.1s
            both;
        }

        .animate-fade-in-up-delay-2 {
          animation:
            editorial-fade-in-up
            0.8s
            ease-out
            0.2s
            both;
        }

        .animate-fade-in-up-delay-3 {
          animation:
            editorial-fade-in-up
            0.8s
            ease-out
            0.3s
            both;
        }

        .animate-fade-in-up-delay-4 {
          animation:
            editorial-fade-in-up
            0.8s
            ease-out
            0.4s
            both;
        }

        .animate-fade-in-up-delay-5 {
          animation:
            editorial-fade-in-up
            0.8s
            ease-out
            0.5s
            both;
        }

        .animate-float-slow {
          animation:
            editorial-float-slow
            8s
            ease-in-out
            infinite;
        }

        .animate-float-slow-reverse {
          animation:
            editorial-float-slow-reverse
            10s
            ease-in-out
            infinite;
        }

        .animate-pulse-slow {
          animation:
            editorial-pulse-slow
            4s
            ease-in-out
            infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up-delay-1,
          .animate-fade-in-up-delay-2,
          .animate-fade-in-up-delay-3,
          .animate-fade-in-up-delay-4,
          .animate-fade-in-up-delay-5,
          .animate-float-slow,
          .animate-float-slow-reverse,
          .animate-pulse-slow {
            animation: none !important;
          }

          .transition-all,
          .transition-opacity,
          .transition-transform,
          .transition-\[width\] {
            transition-duration: 0ms !important;
          }
        }
      `}</style>
    </section>
  );
}
