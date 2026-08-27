import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export type ProgrammeShowcaseItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  accent: string;
  icon?: string;
  eyebrow?: string;
  active?: boolean;
};

type ProgrammeShowcaseProps = {
  items: ProgrammeShowcaseItem[];
};

export function ProgrammeShowcase({ items }: ProgrammeShowcaseProps) {
  const visibleItems = items.filter((item) => item.active !== false);
  if (!visibleItems.length) return null;

  return (
    <section className="overflow-hidden bg-white px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-heading text-5xl font-bold leading-none text-brand-ink sm:text-6xl lg:text-7xl">
              What we do
            </h2>
            <p className="mt-5 max-w-2xl font-heading text-2xl font-bold leading-tight text-brand-ink sm:text-3xl">
              Eight initiatives opening real pathways into tech
            </p>
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-[1.8] text-slate-500">
              From girls&apos; participation and school clubs to entrepreneurship and rural
              access, each initiative is designed to move young people from interest to
              opportunity.
            </p>
          </div>

          <Button
            href="/what-we-do"
            variant="pink-outline"
            className="group/button w-fit shrink-0"
          >
            Explore all initiatives

            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
          </Button>
        </div>

        {/* Programme cards */}
        <div
          className="
            grid auto-cols-[18.5rem] grid-flow-col gap-5
            overflow-x-auto pb-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            snap-x snap-mandatory

            md:grid-flow-row
            md:grid-cols-2
            md:overflow-visible
            md:pb-0

            xl:grid-cols-4
          "
        >
          {visibleItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              aria-label={`Learn more about ${item.title}`}
              className="
                group relative min-h-[29rem] snap-start
                overflow-hidden rounded-[2rem]
                border border-brand-border bg-white
                shadow-[0_18px_45px_rgba(1,82,190,0.10)]
                transition-all duration-500 ease-out
                hover:-translate-y-2
                hover:border-brand-navy/20
                hover:shadow-[0_28px_60px_rgba(1,82,190,0.17)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-gold
                focus-visible:ring-offset-4
              "
            >
              {/* Image area */}
              <div className="absolute inset-x-0 top-0 h-[57%] overflow-hidden bg-brand-mist">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={index < 4}
                  sizes="(max-width: 767px) 18.5rem, (max-width: 1279px) 50vw, 25vw"
                  className="
                    object-cover
                    transition-[transform,filter]
                    duration-700 ease-out
                    group-hover:scale-[1.06]
                    group-hover:saturate-[1.08]
                  "
                />

                {/* Image tint */}
                <div className="absolute inset-0 bg-brand-navy/10 transition-colors duration-500 group-hover:bg-brand-navy/5" />

                {/* Accent colour wash */}
                <div
                  className="
                    absolute inset-0 opacity-30
                    mix-blend-multiply
                    transition-opacity duration-500
                    group-hover:opacity-45
                  "
                  style={{
                    background: `linear-gradient(
                      135deg,
                      ${item.accent}90 0%,
                      ${item.accent}20 42%,
                      transparent 75%
                    )`,
                  }}
                />

                {/* Edge vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_25%,rgba(5,25,52,0.32)_100%)]" />

                {/* Fade image into card content */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

                {/* Programme category */}
                <div className="absolute left-5 top-5">
                  <span
                    className="
                      inline-flex rounded-control border border-white/35
                      bg-white/90 px-3 py-1.5
                      text-[0.62rem] font-bold uppercase
                      tracking-[0.17em] text-brand-navy
                      shadow-sm backdrop-blur-md
                    "
                  >
                    {item.eyebrow ?? "Initiative"}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="relative flex min-h-[29rem] flex-col p-5">
                {/*
                  16.53rem = 57% of the card's min-h-[29rem], i.e. the image
                  area's own height. That places the title exactly 1.25rem
                  (one card-padding unit) below the image edge, matching the
                  card's own spacing rhythm now that the floating icon badge
                  that used to straddle this seam is gone.
                */}
                <div className="mt-[16.53rem] flex flex-1 flex-col">
                  <h3
                    className="
                      font-heading text-[1.55rem] font-bold
                      leading-[1.15] text-brand-ink
                      transition-colors duration-300
                      group-hover:text-brand-navy
                    "
                  >
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-ink/70">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <span className="text-sm font-bold text-brand-navy">
                      Learn more
                    </span>

                    <span
                      className="
                        flex h-11 w-11 shrink-0 items-center
                        justify-center rounded-full
                        border border-brand-border bg-brand-mist
                        text-brand-navy
                        transition-all duration-300
                        group-hover:rotate-6
                        group-hover:border-brand-gold
                        group-hover:bg-brand-gold
                      "
                    >
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="
                  absolute inset-x-8 bottom-0 h-1
                  origin-left scale-x-75 rounded-t-full
                  opacity-75 transition-all duration-500
                  group-hover:scale-x-100
                  group-hover:opacity-100
                "
                style={{ backgroundColor: item.accent }}
              />

              {/* Hover border highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/30" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
