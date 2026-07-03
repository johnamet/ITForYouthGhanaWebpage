"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { emojiToIconImage } from "@/lib/utils/icon-map";

import { useCountUp } from "@/hooks/useCountUp";
import type { HighlightStat } from "@/types/content";

type ImpactCounterProps = {
  stats: HighlightStat[];
};

function splitStatValue(value: string) {
  const match = value.trim().match(/^([\d,.]+)(.*)$/);
  if (!match) {
    return { numeric: 0, suffix: value };
  }

  const numeric = Number(match[1].replace(/,/g, ""));
  return {
    numeric: Number.isNaN(numeric) ? 0 : numeric,
    suffix: match[2].trim(),
  };
}

function ImpactCounterItem({ stat, start }: { stat: HighlightStat; start: boolean }) {
  const parsed = useMemo(() => splitStatValue(stat.value), [stat.value]);
  const count = useCountUp(parsed.numeric, 2000, start);

  return (
    <div className="px-6 py-8 text-center sm:px-8">
      {(() => stat.iconImage ?? emojiToIconImage(stat.icon))() ? (
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-mist">
          <Image src={(stat.iconImage ?? emojiToIconImage(stat.icon)) as string} alt={stat.label} width={28} height={28} className="h-7 w-7 object-contain" />
        </span>
      ) : stat.icon ? (
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-mist text-2xl">
          {stat.icon}
        </span>
      ) : null}
      <p className="font-heading text-[2.8rem] font-bold leading-none text-brand-navy">
        {count.toLocaleString("en-US")}
        {parsed.suffix ? <span className="text-brand-gold">{parsed.suffix}</span> : null}
      </p>
      <p className="mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brand-ink">
        {stat.label}
      </p>
      {stat.description ? (
        <p className="mt-2 text-[0.78rem] leading-6 text-slate-500">{stat.description}</p>
      ) : null}
    </div>
  );
}

export function ImpactCounter({ stats }: ImpactCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!ref.current || hasEntered) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasEntered]);

  return (
    <section ref={ref} className="border-b border-brand-border bg-white">
      <div className="mx-auto grid max-w-6xl divide-y divide-brand-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {stats.map((stat) => (
          <ImpactCounterItem key={stat.label} stat={stat} start={hasEntered} />
        ))}
      </div>
    </section>
  );
}
