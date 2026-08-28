"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { ProgrammeShowcaseItem } from "@/types/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { safeImageSrc } from "@/lib/utils/image-src";

type InitiativesTreeProps = {
  items: ProgrammeShowcaseItem[];
};

type InitiativeCardProps = {
  item: ProgrammeShowcaseItem;
  index: number;
};

/**
 * Where a card lands in the three-column grid at `xl`.
 *
 * The first card spans two columns, so a card's column is not simply
 * `index % 3`. Card 0 consumes cells 0 and 1; every later card sits in the
 * single cell `index + 1`. Middle-column cards are the ones we drop, which
 * breaks the rows visually without leaving a hole anywhere in the grid.
 */
function isMiddleColumn(index: number) {
  return index > 0 && (index + 1) % 3 === 1;
}

function InitiativeCard({ item, index }: InitiativeCardProps) {
  const imageSrc = safeImageSrc(item.image);
  const isFeature = index === 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group overflow-hidden rounded-[24px] border border-brand-border bg-white shadow-editorial transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,40,80,0.12)]",
        isFeature && "xl:col-span-2",
        isMiddleColumn(index) && "xl:mt-16",
      )}
    >
      <div className={cn(isFeature && "xl:flex xl:items-stretch")}>
        <div
          className={cn(
            "relative h-52 overflow-hidden bg-brand-mist",
            isFeature && "xl:h-auto xl:w-[45%] xl:shrink-0",
          )}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${item.title} participants`}
              fill
              sizes={
                isFeature
                  ? "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 30vw"
                  : "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
              }
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : null}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent",
              isFeature && "xl:bg-gradient-to-r xl:from-transparent xl:to-brand-navy/25",
            )}
          />
        </div>

        <div
          className={cn(
            "flex min-h-[220px] flex-col p-5 xl:p-6",
            isFeature && "xl:min-h-[19rem] xl:flex-1 xl:justify-center xl:p-8",
          )}
        >
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-brand-accent">
            {item.eyebrow ?? "Initiative"}
          </p>
          <h3
            className={cn(
              "mt-2 font-heading text-xl font-bold leading-tight text-brand-navy lg:text-2xl",
              isFeature && "xl:text-3xl",
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              "mt-3 text-sm leading-6 text-brand-muted",
              // The seven standard cards are clamped so they stay a matching
              // height against the staggered offsets; the feature card has the
              // room to run its description in full.
              !isFeature && "line-clamp-3",
              isFeature && "xl:text-base xl:leading-7",
            )}
          >
            {item.description}
          </p>

          <Link
            href={item.href}
            className={cn(
              "mt-auto inline-flex w-fit items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2",
              isFeature && "xl:mt-7",
            )}
          >
            Explore initiative
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function InitiativesTree({ items }: InitiativesTreeProps) {
  const visibleItems = items.filter((item) => item.active !== false).slice(0, 8);

  if (!visibleItems.length) return null;

  return (
    <section
      aria-labelledby="initiatives-tree-title"
      className="relative overflow-hidden border-b border-brand-border bg-[#F7F9FC] px-5 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full border border-brand-primary/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-36 h-56 w-56 rounded-full border border-brand-primary/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-16 h-96 w-96 rounded-full border border-brand-navy/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-28 h-72 w-72 rounded-full border border-brand-navy/10"
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-accent">
              The Initiatives
            </p>
            <h2
              id="initiatives-tree-title"
              className="font-heading text-4xl font-bold leading-[1.02] tracking-tight text-brand-navy sm:text-5xl lg:text-6xl"
            >
              One mission. Eight connected initiatives.
            </h2>
            <p className="mt-5 max-w-2xl text-[0.95rem] leading-[1.8] text-brand-muted">
              Each pathway meets young people at a different moment—from first access to
              skills, confidence, enterprise, and influence—while building from the same mission.
            </p>
          </div>

          <Button href="/what-we-do" variant="pink-outline" className="group w-fit shrink-0">
            Explore all initiatives
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Button>
        </header>

        {/*
          Eight cards, no orphan row at either breakpoint: at `md` the eight
          single cells make four rows of two, and at `xl` the feature card's
          two cells plus seven single cells make nine — three exact rows of
          three. `items-start` lets the offset cards actually sit lower
          instead of stretching back to their row's height.
        */}
        <div className="mt-12 grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item, index) => (
            <InitiativeCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
