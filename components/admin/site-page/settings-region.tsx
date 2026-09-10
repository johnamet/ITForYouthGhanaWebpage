"use client";

import type { DynamicSitePage } from "@/types/content";

import { inputClass, panelClass, type SitePageRegionProps } from "./shared";

export function SettingsRegion({
  value,
  onChange,
  showSlugField = true,
  showPublishingFields = true,
  slugBasePath = "/who-we-are",
}: SitePageRegionProps & {
  showSlugField?: boolean;
  showPublishingFields?: boolean;
  slugBasePath?: string;
}) {
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  if (!showSlugField && !showPublishingFields) {
    return null;
  }

  return (
    <section className={panelClass}>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
          Publishing
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
          Page settings
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {showSlugField ? (
          <div>
            <label htmlFor="slug" className="text-sm font-bold text-brand-ink">
              URL slug
            </label>
            <input
              id="slug"
              required
              value={value.slug}
              onChange={(event) => update("slug", event.target.value)}
              className={inputClass}
              placeholder="board-of-directors"
            />
            <p className="mt-2 text-xs font-medium text-slate-500">
              This becomes {slugBasePath}/{value.slug || "your-slug"}.
            </p>
          </div>
        ) : null}
        {showPublishingFields ? (
          <>
            <div>
              <label htmlFor="status" className="text-sm font-bold text-brand-ink">
                Status
              </label>
              <select
                id="status"
                value={"status" in value ? value.status : "draft"}
                onChange={(event) =>
                  update("status", event.target.value as DynamicSitePage["status"])
                }
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label htmlFor="order" className="text-sm font-bold text-brand-ink">
                Order
              </label>
              <input
                id="order"
                type="number"
                min={1}
                value={"order" in value ? value.order : 0}
                onChange={(event) => update("order", Number(event.target.value))}
                className={inputClass}
              />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
