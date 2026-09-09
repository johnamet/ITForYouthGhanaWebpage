"use client";

import { inputClass, panelClass, type SitePageRegionProps } from "./shared";

export function HeroRegion({ value, onChange }: SitePageRegionProps) {
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  return (
    <section className={panelClass}>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
          Page identity
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
          Hero and overview copy
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="eyebrow" className="text-sm font-bold text-brand-ink">
            Eyebrow
          </label>
          <input
            id="eyebrow"
            value={value.eyebrow}
            onChange={(event) => update("eyebrow", event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="title" className="text-sm font-bold text-brand-ink">
            Title
          </label>
          <input
            id="title"
            value={value.title}
            onChange={(event) => update("title", event.target.value)}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="text-sm font-bold text-brand-ink">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={value.description}
            onChange={(event) => update("description", event.target.value)}
            className={`${inputClass} h-28`}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="intro" className="text-sm font-bold text-brand-ink">
            Intro (optional)
          </label>
          <textarea
            id="intro"
            value={value.intro}
            onChange={(event) => update("intro", event.target.value)}
            className={`${inputClass} h-32`}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="heroImage" className="text-sm font-bold text-brand-ink">
            Hero image path
          </label>
          <input
            id="heroImage"
            value={value.heroImage ?? ""}
            onChange={(event) => update("heroImage", event.target.value)}
            className={inputClass}
            placeholder="/images/randomPictures/groupworkstudents.jpg"
          />
        </div>
      </div>
    </section>
  );
}
