"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import type { ProgrammeShowcaseItem } from "@/components/home/programme-showcase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { safeImageSrc } from "@/lib/utils/image-src";

type InitiativesTreeProps = {
  items: ProgrammeShowcaseItem[];
};

type InitiativeCardProps = {
  item: ProgrammeShowcaseItem;
};

function InitiativeCard({ item }: InitiativeCardProps) {
  const imageSrc = safeImageSrc(item.image);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group overflow-hidden rounded-[24px] border border-brand-border bg-white shadow-editorial transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,40,80,0.12)]"
    >
      <div className="relative h-52 overflow-hidden bg-brand-mist">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${item.title} participants`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />
      </div>

      <div className="flex min-h-[220px] flex-col p-5 xl:p-6">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-brand-accent">
          {item.eyebrow ?? "Initiative"}
        </p>
        <h3 className="mt-2 font-heading text-xl font-bold leading-tight text-brand-navy lg:text-2xl">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-brand-muted">{item.description}</p>

        <Link
          href={item.href}
          className="mt-auto inline-flex w-fit items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        >
          Explore initiative
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
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
              The ITFY ecosystem
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

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <InitiativeCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
