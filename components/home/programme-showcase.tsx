import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

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

  return (
    <section className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="What we do"
            title="Eight initiatives opening real pathways into tech"
            description="From girls' participation and school clubs to entrepreneurship and rural access, each initiative is designed to move young people from interest to opportunity."
          />
          <Link
            href="/what-we-do"
            className="inline-flex items-center gap-2 rounded-full border border-brand-border px-5 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-gold hover:text-brand-gold"
          >
            Explore all initiatives
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid auto-cols-[18rem] grid-flow-col gap-4 overflow-x-auto pb-2 [scrollbar-width:none] snap-x snap-mandatory md:grid-flow-row md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
          {visibleItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative min-h-[22rem] snap-start overflow-hidden rounded-[28px] bg-brand-navy shadow-[0_16px_40px_rgba(12,45,90,0.14)]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 767px) 18rem, (max-width: 1279px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-brand-navy/10" />
              <div
                className="absolute inset-0 opacity-70 transition duration-500 group-hover:opacity-90"
                style={{
                  background: `linear-gradient(180deg, rgba(12,45,90,0.08) 0%, ${item.accent}D9 100%)`,
                }}
              />

              <div className="relative flex h-full flex-col justify-between p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                    style={{ backgroundColor: item.accent }}
                    aria-hidden="true"
                  >
                    {item.icon ?? "•"}
                  </span>
                  <span className="rounded-full bg-white/14 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                    {item.eyebrow ?? "Initiative"}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-white/82">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>

              <div
                className="absolute inset-x-5 bottom-0 h-1 rounded-full opacity-80 transition duration-300 group-hover:opacity-100"
                style={{ backgroundColor: item.accent }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
