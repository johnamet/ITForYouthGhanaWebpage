"use client";

import { Plus, Trash2 } from "lucide-react";

import type { ContentBlock } from "@/types/content";

import { emptySection, fromLines, inputClass, panelClass, toLines, type SitePageRegionProps } from "./shared";

export function BodySectionsRegion({ value, onChange }: SitePageRegionProps) {
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  const updateSection = <Key extends keyof ContentBlock>(
    index: number,
    key: Key,
    next: ContentBlock[Key],
  ) =>
    update(
      "sections",
      value.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [key]: next } : section,
      ),
    );

  const addSection = () => update("sections", [...value.sections, emptySection]);
  const removeSection = (index: number) =>
    update(
      "sections",
      value.sections.filter((_, sectionIndex) => sectionIndex !== index),
    );

  return (
    <section className={panelClass}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            Story
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
            Content sections
          </h2>
        </div>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>
      </div>

      <div className="space-y-5">
        {value.sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="rounded-2xl border border-brand-border p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <label className="text-sm font-bold text-brand-ink">Title</label>
                <input
                  value={section.title}
                  onChange={(event) => updateSection(index, "title", event.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="mt-8 h-10 rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-700"
              >
                <Trash2 className="mr-1 inline-block h-4 w-4" />
                Remove
              </button>
            </div>
            <label className="mt-4 block text-sm font-bold text-brand-ink">Body</label>
            <textarea
              value={section.body}
              onChange={(event) => updateSection(index, "body", event.target.value)}
              className={`${inputClass} h-32`}
            />
            <label className="mt-4 block text-sm font-bold text-brand-ink">
              Bullets, one per line
            </label>
            <textarea
              value={toLines(section.bullets)}
              onChange={(event) => updateSection(index, "bullets", fromLines(event.target.value))}
              className={`${inputClass} h-24`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
