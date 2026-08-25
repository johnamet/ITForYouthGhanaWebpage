"use client";

import Image from "next/image";
import clsx from "clsx";

import { emojiToIconImage } from "@/lib/utils/icon-map";

export type AlternatingFeatureItem = {
  title: string;
  description?: string;
  // Prefer a richer visual if available; falls back to iconImage or emoji → icon image
  image?: string;
  iconImage?: string;
  icon?: string;
  number?: string;
  imageAlt?: string;
};

type AlternatingFeatureRowProps = {
  items: AlternatingFeatureItem[];
  className?: string;
};

export function AlternatingFeatureRow({ items, className }: AlternatingFeatureRowProps) {
  if (!items?.length) return null;

  return (
    <div className={clsx("space-y-10", className)}>
      {items.map((item, index) => {
        const isReversed = index % 2 === 1;
        const visual = item.image || item.iconImage || (item.icon ? emojiToIconImage(item.icon) : undefined);
        const alt = item.imageAlt || item.title;

        return (
          <div
            key={`${item.title}-${index}`}
            className={clsx(
              "grid gap-6 lg:items-center",
              // On large screens, two columns with slight text bias
              "lg:grid-cols-[1.05fr_0.95fr]",
            )}
          >
            {/* Visual */}
            <div className={clsx("order-1", isReversed ? "lg:order-2" : "lg:order-1")}> 
              <div className="relative min-h-[18rem] overflow-hidden rounded-[32px] border border-brand-border bg-brand-mist">
                {visual ? (
                  <Image
                    src={visual}
                    alt={alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>

            {/* Copy */}
            <div className={clsx("order-2", isReversed ? "lg:order-1" : "lg:order-2")}> 
              <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="h-7 w-7" aria-hidden="true" />
                  {item.number ? (
                    <span className="font-heading text-3xl font-bold text-brand-accent/70">{item.number}</span>
                  ) : null}
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold text-brand-ink">{item.title}</h3>
                {item.description ? (
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
