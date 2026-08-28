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

const TREE_LAYOUT = [
  {
    position: "left-[1%] top-[20%] w-[22%]",
    shape: "rounded-[28px_12px_28px_12px]",
    surface: "bg-brand-warm",
    kicker: "Flagship",
    path: "M576 398 C525 340 455 300 288 278 C180 264 147 224 134 179",
  },
  {
    position: "left-[16%] top-[4%] w-[23%]",
    shape: "rounded-[12px_28px_12px_28px]",
    surface: "bg-white",
    kicker: "Core pathway",
    path: "M576 398 C528 320 484 224 414 156 C374 118 350 106 306 102",
  },
  {
    position: "left-[39%] top-0 w-[22%]",
    shape: "rounded-[28px_12px_28px_12px]",
    surface: "bg-brand-mist",
    kicker: "Venture pathway",
    path: "M576 398 C556 296 533 199 527 106",
  },
  {
    position: "right-[16%] top-[4%] w-[23%]",
    shape: "rounded-[12px_28px_12px_28px]",
    surface: "bg-white",
    kicker: "Challenge format",
    path: "M576 398 C592 296 618 202 630 106",
  },
  {
    position: "right-[1%] top-[20%] w-[22%]",
    shape: "rounded-[28px_12px_28px_12px]",
    surface: "bg-brand-mist",
    kicker: "Access initiative",
    path: "M576 398 C626 319 674 224 738 156 C775 118 805 107 844 102",
  },
  {
    position: "left-[1%] top-[49%] w-[24%]",
    shape: "rounded-[12px_28px_12px_28px]",
    surface: "bg-white",
    kicker: "Community pathway",
    path: "M576 398 C475 376 376 374 243 386 C188 391 152 376 129 349",
  },
  {
    position: "right-[1%] top-[49%] w-[24%]",
    shape: "rounded-[28px_12px_28px_12px]",
    surface: "bg-brand-warm",
    kicker: "Influence work",
    path: "M576 398 C680 376 782 374 909 386 C967 391 1001 374 1022 349",
  },
  {
    position: "right-[1%] top-[20%] mt-20 w-[22%]",
    shape: "rounded-[28px_12px_28px_12px]",
    surface: "bg-white",
    kicker: "School network",
    path: "M576 398 C626 339 708 299 864 278 C972 264 1004 224 1017 179",
  },
] as const;

type InitiativeDetailProps = {
  item: ProgrammeShowcaseItem;
  mode: "desktop" | "mobile";
};

function InitiativeDetail({ item, mode }: InitiativeDetailProps) {
  const imageSrc = safeImageSrc(item.image);

  if (mode === "mobile") {
    return (
      <motion.article
        id={`mobile-initiative-detail-${item.id}`}
        aria-live="polite"
        initial={{ opacity: 0, height: 0, y: -8 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: -8 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="overflow-hidden rounded-[22px] border border-brand-border bg-white shadow-editorial"
      >
        <div className="relative h-52 overflow-hidden bg-brand-mist">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${item.title} participants`}
              fill
              sizes="(max-width: 767px) 100vw, 1px"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />
        </div>
        <div className="p-5">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-brand-accent">
            {item.eyebrow ?? "Initiative"}
          </p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-brand-navy">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-brand-muted">{item.description}</p>
          <Link
            href={item.href}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            Explore initiative
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      id="desktop-initiative-detail"
      aria-live="polite"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.985 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="absolute left-1/2 top-[24%] z-20 grid h-[250px] w-1/2 -translate-x-1/2 grid-cols-[0.4fr_0.6fr] overflow-hidden rounded-[24px] border border-brand-border bg-white shadow-editorial ring-4 ring-[#F7F9FC]"
    >
      <div className="relative h-full overflow-hidden bg-brand-mist">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${item.title} participants`}
            fill
            sizes="(max-width: 1023px) 20vw, 230px"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/35 via-transparent to-brand-accent/10" />
        <p className="absolute bottom-4 left-4 rounded-control bg-white/90 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.14em] text-brand-navy backdrop-blur">
          Focused initiative
        </p>
      </div>

      <div className="flex min-w-0 flex-col justify-center p-5 xl:p-6">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-brand-accent">
          {item.eyebrow ?? "Initiative"}
        </p>
        <h3 className="mt-2 font-heading text-xl font-bold leading-tight text-brand-navy lg:text-2xl xl:text-3xl">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-xs leading-5 text-brand-muted xl:text-sm xl:leading-6">
          {item.description}
        </p>
        <Link
          href={item.href}
          className="mt-4 inline-flex min-h-10 w-fit items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        >
          Explore initiative
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

export function InitiativesTree({ items }: InitiativesTreeProps) {
  const visibleItems = items.filter((item) => item.active !== false).slice(0, TREE_LAYOUT.length);
  const [desktopActiveId, setDesktopActiveId] = useState<string | null>(null);
  const [mobileActiveId, setMobileActiveId] = useState<string | null>(
    () => visibleItems[0]?.id ?? null,
  );
  if (!visibleItems.length) return null;

  const desktopActiveItem =
    visibleItems.find((item) => item.id === desktopActiveId) ?? null;

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
              Each branch meets young people at a different moment—from first access to
              skills, confidence, enterprise, and influence—but every pathway grows from
              the same mission.
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

        <div className="mt-14 hidden md:block">
          <p className="mb-5 text-center text-[0.64rem] font-bold uppercase tracking-[0.19em] text-brand-muted">
            Select a branch to reveal its story
          </p>

          <div className="relative h-[600px]" aria-label="Connected initiatives ecosystem diagram">
            <svg
              aria-hidden="true"
              viewBox="0 0 1152 600"
              className="pointer-events-none absolute inset-0 h-full w-full"
              fill="none"
            >
              {visibleItems.map((item, index) => {
                const isActive = desktopActiveId === item.id;
                return (
                  <path
                    key={item.id}
                    d={TREE_LAYOUT[index].path}
                    stroke={isActive ? "#D70B52" : "#1E72BA"}
                    strokeWidth={isActive ? 4 : 2}
                    strokeLinecap="round"
                    opacity={isActive ? 1 : desktopActiveId ? 0.16 : 0.24}
                    className="transition-all duration-300"
                  />
                );
              })}

              <path
                d="M576 497 C570 464 572 432 576 398"
                stroke="#142850"
                strokeWidth="13"
                strokeLinecap="round"
              />
              <path
                d="M576 497 C570 464 572 432 576 398"
                stroke="#1E72BA"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.75"
              />
              <g stroke="#142850" strokeWidth="2" strokeLinecap="round" opacity="0.76">
                <path d="M576 496 C519 511 455 534 376 559" />
                <path d="M576 496 C549 521 527 543 497 568" />
                <path d="M576 496 C603 521 625 543 655 568" />
                <path d="M576 496 C633 511 697 534 776 559" />
              </g>
              <g fill="#F7F9FC" stroke="#1E72BA" strokeWidth="2">
                <circle cx="576" cy="398" r="8" />
                <circle cx="576" cy="398" r="3" fill="#D70B52" stroke="none" />
                <circle cx="455" cy="300" r="4" />
                <circle cx="697" cy="300" r="4" />
              </g>
            </svg>

            {visibleItems.map((item, index) => {
              const layout = TREE_LAYOUT[index];
              const isActive = desktopActiveId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-controls="desktop-initiative-detail"
                  aria-expanded={isActive}
                  aria-pressed={isActive}
                  aria-label={`${item.title}: ${isActive ? "close details" : "open details"}`}
                  onClick={() =>
                    setDesktopActiveId((current) => (current === item.id ? null : item.id))
                  }
                  className={cn(
                    "group absolute flex min-h-14 items-center justify-between border border-brand-border px-5 py-3 text-left text-sm font-bold text-brand-navy shadow-[0_8px_24px_rgba(1,82,190,0.08)] transition duration-300 hover:-translate-y-1 hover:border-brand-accent hover:shadow-[0_16px_38px_rgba(20,40,80,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2",
                    layout.position,
                    layout.shape,
                    layout.surface,
                    isActive &&
                      "-translate-y-1 !border-brand-accent !bg-brand-navy !text-white shadow-[0_16px_38px_rgba(20,40,80,0.18)]",
                  )}
                >
                  <span>
                    <span
                      className={cn(
                        "mb-0.5 block text-[0.58rem] uppercase tracking-[0.17em] text-brand-muted transition-colors",
                        isActive && "!text-white/75",
                      )}
                    >
                      {layout.kicker}
                    </span>
                    {item.title}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 shrink-0 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100",
                      isActive && "translate-x-0.5 opacity-100",
                    )}
                  />
                </button>
              );
            })}

            <AnimatePresence mode="wait">
              {desktopActiveItem ? (
                <InitiativeDetail key={desktopActiveItem.id} item={desktopActiveItem} mode="desktop" />
              ) : null}
            </AnimatePresence>

            <div className="absolute left-1/2 top-[66%] flex min-h-28 w-[22rem] -translate-x-1/2 items-center justify-center rounded-media border border-brand-navy bg-brand-navy px-8 py-5 text-center shadow-editorial">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.19em] text-white/80">
                  Shared learning ecosystem
                </p>
                <p className="mt-2 font-heading text-xl font-bold leading-tight text-white">
                  IT For Youth Ghana
                </p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0">
              <p className="mb-4 text-center text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-muted">
                The roots that sustain every pathway
              </p>
              <div className="mx-auto grid max-w-2xl grid-cols-4 gap-3">
                {['Access', 'Inclusion', 'Skills', 'Opportunity'].map((root) => (
                  <div
                    key={root}
                    className="rounded-control border border-brand-border bg-white px-4 py-3 text-center text-xs font-bold text-brand-navy"
                  >
                    {root}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:hidden">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-5 left-5 top-5 w-px bg-brand-primary/40"
            />
            <div className="relative pl-11">
              <p className="mb-4 text-[0.64rem] font-bold uppercase tracking-[0.19em] text-brand-muted">
                Roots
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Access', 'Inclusion', 'Skills', 'Opportunity'].map((root) => (
                  <div
                    key={root}
                    className="rounded-control border border-brand-border bg-white px-3 py-3 text-center text-xs font-bold text-brand-navy"
                  >
                    {root}
                  </div>
                ))}
              </div>

              <div className="my-5 h-7 w-px bg-brand-navy" />
              <div className="rounded-media bg-brand-navy px-5 py-5 text-white shadow-editorial">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/80">
                  Shared learning ecosystem
                </p>
                <p className="mt-2 font-heading text-xl font-bold text-white">
                  IT For Youth Ghana
                </p>
              </div>
              <div className="my-5 h-7 w-px bg-brand-primary" />

              <p className="mb-4 text-[0.64rem] font-bold uppercase tracking-[0.19em] text-brand-muted">
                Tap a branch to meet the initiative
              </p>
              <nav aria-label="Initiatives" className="grid gap-3">
                {visibleItems.map((item, index) => {
                  const isActive = mobileActiveId === item.id;
                  const detailId = `mobile-initiative-detail-${item.id}`;

                  return (
                    <div key={item.id} className="grid gap-3">
                      <button
                        type="button"
                        aria-controls={detailId}
                        aria-expanded={isActive}
                        aria-pressed={isActive}
                        onClick={() =>
                          setMobileActiveId((current) => (current === item.id ? null : item.id))
                        }
                        className={cn(
                          "flex min-h-12 w-full items-center justify-between border border-brand-border px-4 py-3 text-left text-sm font-bold text-brand-navy transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2",
                          TREE_LAYOUT[index].shape,
                          TREE_LAYOUT[index].surface,
                          isActive && "!border-brand-accent !bg-brand-navy !text-white",
                        )}
                      >
                        <span>{item.title}</span>
                        <ArrowRight
                          aria-hidden="true"
                          className={cn(
                            "h-4 w-4 rotate-90 transition-transform duration-300",
                            isActive && "-rotate-90",
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isActive ? (
                          <InitiativeDetail key={item.id} item={item} mode="mobile" />
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
