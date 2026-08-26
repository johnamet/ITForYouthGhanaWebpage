"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { MediaFallback } from "@/components/media/media-fallback";
import { Button } from "@/components/ui/button";
import { splitTitleEmphasis, stripTitleEmphasis } from "@/lib/page-sections/title-emphasis";
import { cn } from "@/lib/utils/cn";
import type { HeroSection, SectionActionContent } from "@/types/page-sections";

const actionVariants = {
  gold: "primary",
  navy: "dark",
  light: "white",
  text: "white-outline",
} as const;

function HeroActions({ actions }: { actions?: SectionActionContent[] }) {
  if (!actions?.length) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {actions.map((action, index) => (
        <Button
          key={`${action.href}-${action.label}`}
          href={action.href}
          size="lg"
          variant={actionVariants[action.style ?? (index === 0 ? "gold" : "light")]}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

/**
 * The headline in two voices: a plain setup in white, then the accented phrase
 * in the display serif's italic and the on-dark crimson. See
 * `lib/page-sections/title-emphasis.ts` for how the accent is chosen.
 */
function  HeroHeadline({ title, titleAccent }: { title: string; titleAccent?: string }) {
  return (
    <h1 className="mt-5 max-w-[14ch] font-heading text-[clamp(3.2rem,6.4vw,6.9rem)] font-bold leading-[1.0] tracking-[-0.035em] text-white">
      {splitTitleEmphasis(title, titleAccent).map((segment, index) =>
        segment.accent ? (
          <em key={index} className="italic text-brand-accent-on-dark">
            {segment.text}
          </em>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </h1>
  );
}

export function EditorialHero({ section }: { section: HeroSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = section.slides[activeIndex] ?? section.slides[0];

  useEffect(() => {
    if (section.slides.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % section.slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [section.slides.length]);

  if (!active) return null;

  const publication = section.variant === "publication";
  const data = section.variant === "data";
  const immersive = section.variant === "immersive";

  return (
    <section
      id={section.anchor}
      className={cn("bg-brand-warm px-3 py-4 sm:px-6 sm:py-7", section.theme === "mist" && "bg-brand-mist")}
    >
      <div
        className={cn(
          "relative mx-auto grid min-h-[620px] max-w-[1240px] overflow-hidden rounded-panel bg-brand-deep shadow-editorial lg:grid-cols-[0.88fr_1.12fr]",
          publication && "lg:grid-cols-[0.72fr_1.28fr]",
          data && "lg:grid-cols-[1fr_1fr]",
          immersive && "min-h-[680px] lg:grid-cols-[0.78fr_1.22fr]",
        )}
      >
        <div className="relative z-10 flex flex-col justify-center bg-hero-copy px-7 py-14 text-white sm:px-12 lg:px-16">
          {active.eyebrow ? (
            <p className="flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-brand-accent-on-dark sm:text-[0.875rem]">
              <span aria-hidden="true" className="h-0.5 w-[22px] bg-current" />
              {active.eyebrow}
            </p>
          ) : null}
          <HeroHeadline title={active.title} titleAccent={active.titleAccent} />
          {active.body ? (
            <p className="mt-7 max-w-[50ch] text-[1.075rem] leading-[1.7] text-white/[0.76]">{active.body}</p>
          ) : null}
          <HeroActions actions={active.actions} />

          {data && active.metrics?.length ? (
            <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/20 pt-6">
              {active.metrics.slice(0, 4).map((metric) => (
                <div key={metric.id}>
                  <strong className="font-heading text-3xl text-white">{metric.value}</strong>
                  <span className="mt-1 block text-xs text-white/70">{metric.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative min-h-[440px] lg:min-h-full">
          {active.media.src.trim() ? (
            <Image
              key={active.media.src}
              src={active.media.src}
              alt={active.media.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 58vw"
              className={cn(
                "object-cover transition-opacity duration-500 motion-reduce:transition-none",
                active.media.focalPoint === "top" && "object-top",
                active.media.focalPoint === "bottom" && "object-bottom",
                active.media.focalPoint === "left" && "object-left",
                active.media.focalPoint === "right" && "object-right",
              )}
            />
          ) : (
            <MediaFallback tone="dark" label={stripTitleEmphasis(active.title)} />
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-deep/35 via-transparent to-transparent" />
          {active.caption || active.media.caption ? (
            <p className="absolute bottom-5 right-5 z-10 max-w-xs rounded-panel bg-white/95 px-5 py-4 font-heading text-base font-bold leading-snug text-brand-deep shadow-panel">
              {active.caption ?? active.media.caption}
            </p>
          ) : null}
        </div>

        {section.slides.length > 1 ? (
          <div className="absolute bottom-5 left-7 z-20 flex items-center gap-2 sm:left-12 lg:left-16">
            {section.slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2 rounded-capsule bg-white/35 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none",
                  index === activeIndex ? "w-9 bg-white" : "w-2 hover:bg-white/70",
                )}
                aria-label={`Show slide ${index + 1}: ${stripTitleEmphasis(slide.title)}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
