"use client";

import { Plus, Trash2 } from "lucide-react";

import type { ActionLink } from "@/types/content";

import { emptyCta, inputClass, panelClass, type SitePageRegionProps } from "./shared";

export function CtasRegion({ value, onChange }: SitePageRegionProps) {
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  const updateCta = <Key extends keyof ActionLink>(
    index: number,
    key: Key,
    next: ActionLink[Key],
  ) =>
    update(
      "ctas",
      value.ctas.map((cta, ctaIndex) =>
        ctaIndex === index ? { ...cta, [key]: next } : cta,
      ),
    );

  const addCta = () => update("ctas", [...value.ctas, emptyCta]);
  const removeCta = (index: number) =>
    update(
      "ctas",
      value.ctas.filter((_, ctaIndex) => ctaIndex !== index),
    );

  return (
    <section className={panelClass}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            Conversion
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
            Hero CTAs
          </h2>
        </div>
        <button
          type="button"
          onClick={addCta}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"
        >
          <Plus className="h-4 w-4" />
          Add CTA
        </button>
      </div>

      <div className="space-y-4">
        {value.ctas.map((cta, index) => (
          <div key={`${cta.label}-${index}`} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_auto]">
            <div>
              <label className="text-sm font-bold text-brand-ink">Label</label>
              <input
                value={cta.label}
                onChange={(event) => updateCta(index, "label", event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-brand-ink">Href</label>
              <input
                value={cta.href}
                onChange={(event) => updateCta(index, "href", event.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => removeCta(index)}
              className="h-10 rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-700"
            >
              <Trash2 className="mr-1 inline-block h-4 w-4" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
