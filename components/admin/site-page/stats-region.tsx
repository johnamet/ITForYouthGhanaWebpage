"use client";

import { Plus, Trash2 } from "lucide-react";

import type { HighlightStat } from "@/types/content";

import { emptyStat, inputClass, panelClass, type SitePageRegionProps } from "./shared";

export function StatsRegion({ value, onChange }: SitePageRegionProps) {
  // Same updater shape the form used, so the moved markup's call sites are
  // unchanged.
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  const updateStat = <Key extends keyof HighlightStat>(
    index: number,
    key: Key,
    next: HighlightStat[Key],
  ) =>
    update(
      "stats",
      value.stats.map((stat, statIndex) =>
        statIndex === index ? { ...stat, [key]: next } : stat,
      ),
    );

  const addStat = () => update("stats", [...value.stats, emptyStat]);
  const removeStat = (index: number) =>
    update(
      "stats",
      value.stats.filter((_, statIndex) => statIndex !== index),
    );

  return (
    <section className={panelClass}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            Proof
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
            Stats
          </h2>
        </div>
        <button
          type="button"
          onClick={addStat}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"
        >
          <Plus className="h-4 w-4" />
          Add stat
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="highlightsEyebrow" className="text-sm font-bold text-brand-ink">
          Highlights label
        </label>
        <input
          id="highlightsEyebrow"
          value={value.highlightsEyebrow ?? ""}
          onChange={(event) => update("highlightsEyebrow", event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-4">
        {value.stats.map((stat, index) => (
          <div
            key={index}
            className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[0.6fr_1fr_1.4fr_0.6fr_1fr_auto]"
          >
            <div>
              <label className="text-sm font-bold text-brand-ink">Value</label>
              <input
                value={stat.value}
                onChange={(event) => updateStat(index, "value", event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-brand-ink">Label</label>
              <input
                value={stat.label}
                onChange={(event) => updateStat(index, "label", event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-brand-ink">Description</label>
              <input
                value={stat.description ?? ""}
                onChange={(event) => updateStat(index, "description", event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-brand-ink">Icon</label>
              <input
                value={stat.icon ?? ""}
                onChange={(event) => updateStat(index, "icon", event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-brand-ink">Icon image URL</label>
              <input
                value={stat.iconImage ?? ""}
                onChange={(event) => updateStat(index, "iconImage", event.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => removeStat(index)}
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
