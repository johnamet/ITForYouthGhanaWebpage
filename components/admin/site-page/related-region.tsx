"use client";

import { Plus, Trash2 } from "lucide-react";

import type { RouteCard } from "@/types/content";

import { emptyRelatedCard, inputClass, panelClass, type SitePageRegionProps } from "./shared";

export function RelatedRegion({ value, onChange }: SitePageRegionProps) {
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  const updateRelatedCard = <Key extends keyof RouteCard>(
    index: number,
    key: Key,
    next: RouteCard[Key],
  ) =>
    update(
      "related",
      value.related.map((card, cardIndex) =>
        cardIndex === index ? { ...card, [key]: next } : card,
      ),
    );

  const addRelatedCard = () => update("related", [...value.related, emptyRelatedCard]);
  const removeRelatedCard = (index: number) =>
    update(
      "related",
      value.related.filter((_, cardIndex) => cardIndex !== index),
    );

  return (
    <section className={panelClass}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            Navigation
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
            Related route cards
          </h2>
        </div>
        <button
          type="button"
          onClick={addRelatedCard}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"
        >
          <Plus className="h-4 w-4" />
          Add card
        </button>
      </div>

      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="exploreEyebrow" className="text-sm font-bold text-brand-ink">
            Explore eyebrow
          </label>
          <input
            id="exploreEyebrow"
            value={value.exploreEyebrow ?? ""}
            onChange={(event) => update("exploreEyebrow", event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="exploreTitle" className="text-sm font-bold text-brand-ink">
            Explore title
          </label>
          <input
            id="exploreTitle"
            value={value.exploreTitle ?? ""}
            onChange={(event) => update("exploreTitle", event.target.value)}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="exploreDescription" className="text-sm font-bold text-brand-ink">
            Explore description
          </label>
          <textarea
            id="exploreDescription"
            value={value.exploreDescription ?? ""}
            onChange={(event) => update("exploreDescription", event.target.value)}
            className={`${inputClass} h-24`}
          />
        </div>
      </div>

      <div className="space-y-4">
        {value.related.map((card, index) => (
          <div key={`${card.href}-${index}`} className="rounded-2xl border border-brand-border p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-brand-ink">Eyebrow</label>
                <input
                  value={card.eyebrow ?? ""}
                  onChange={(event) => updateRelatedCard(index, "eyebrow", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Href</label>
                <input
                  value={card.href}
                  onChange={(event) => updateRelatedCard(index, "href", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Title</label>
                <input
                  value={card.title}
                  onChange={(event) => updateRelatedCard(index, "title", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Description</label>
                <input
                  value={card.description}
                  onChange={(event) => updateRelatedCard(index, "description", event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeRelatedCard(index)}
              className="mt-4 h-10 rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-700"
            >
              <Trash2 className="mr-1 inline-block h-4 w-4" />
              Remove card
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
