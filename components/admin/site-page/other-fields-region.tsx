"use client";

import { Plus, Trash2 } from "lucide-react";

import type { TrainingCohort, TrainingProcessStep } from "@/types/content";

import {
  emptyCohort,
  emptyProcessStep,
  inputClass,
  panelClass,
  type SitePageRegionProps,
} from "./shared";

const subheadingClass = "text-sm font-bold uppercase tracking-[0.18em] text-brand-ink";

export function OtherFieldsRegion({ value, onChange }: SitePageRegionProps) {
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  const updateCohort = (index: number, patch: Partial<TrainingCohort>) =>
    update(
      "cohorts",
      (value.cohorts ?? []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  const updateProcessStep = (index: number, patch: Partial<TrainingProcessStep>) =>
    update(
      "process",
      (value.process ?? []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );

  return (
    <>
      <section className={panelClass}>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            Page sections
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
            Not shown on this page
          </h2>
        </div>

        <p className="rounded-media border border-brand-border bg-brand-alt p-4 text-sm leading-6 text-slate-600">
          This page template does not display these fields. They are kept
          editable because other page templates read them, so anything you enter
          here is saved but will not appear on this page.
        </p>

        <div className="mt-6 space-y-8">
          <div>
            <h3 className={subheadingClass}>Hero video</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="heroVideoUrl" className="text-sm font-bold text-brand-ink">
                  Hero video URL (optional)
                </label>
                <input
                  id="heroVideoUrl"
                  value={value.heroVideoUrl ?? ""}
                  onChange={(event) => update("heroVideoUrl", event.target.value)}
                  className={inputClass}
                  placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…"
                />
              </div>
              <div>
                <label htmlFor="heroVideoThumbnail" className="text-sm font-bold text-brand-ink">
                  Hero video thumbnail (optional)
                </label>
                <input
                  id="heroVideoThumbnail"
                  value={value.heroVideoThumbnail ?? ""}
                  onChange={(event) => update("heroVideoThumbnail", event.target.value)}
                  className={inputClass}
                  placeholder="/images/… or https://…"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={subheadingClass}>Overview copy</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="overviewTitle" className="text-sm font-bold text-brand-ink">
                  Overview title
                </label>
                <input
                  id="overviewTitle"
                  value={value.overviewTitle ?? ""}
                  onChange={(event) => update("overviewTitle", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="overviewDescription" className="text-sm font-bold text-brand-ink">
                  Overview description
                </label>
                <input
                  id="overviewDescription"
                  value={value.overviewDescription ?? ""}
                  onChange={(event) => update("overviewDescription", event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={subheadingClass}>Operating copy</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="operatingEyebrow" className="text-sm font-bold text-brand-ink">
                  Second section eyebrow
                </label>
                <input
                  id="operatingEyebrow"
                  value={value.operatingEyebrow ?? ""}
                  onChange={(event) => update("operatingEyebrow", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="operatingTitle" className="text-sm font-bold text-brand-ink">
                  Second section title
                </label>
                <input
                  id="operatingTitle"
                  value={value.operatingTitle ?? ""}
                  onChange={(event) => update("operatingTitle", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="operatingDescription" className="text-sm font-bold text-brand-ink">
                  Second section description
                </label>
                <textarea
                  id="operatingDescription"
                  value={value.operatingDescription ?? ""}
                  onChange={(event) => update("operatingDescription", event.target.value)}
                  className={`${inputClass} h-24`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={subheadingClass}>Principles copy</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="principlesEyebrow" className="text-sm font-bold text-brand-ink">
                  Third section eyebrow
                </label>
                <input
                  id="principlesEyebrow"
                  value={value.principlesEyebrow ?? ""}
                  onChange={(event) => update("principlesEyebrow", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="principlesTitle" className="text-sm font-bold text-brand-ink">
                  Third section title
                </label>
                <input
                  id="principlesTitle"
                  value={value.principlesTitle ?? ""}
                  onChange={(event) => update("principlesTitle", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="principlesDescription" className="text-sm font-bold text-brand-ink">
                  Third section description
                </label>
                <textarea
                  id="principlesDescription"
                  value={value.principlesDescription ?? ""}
                  onChange={(event) => update("principlesDescription", event.target.value)}
                  className={`${inputClass} h-24`}
                />
              </div>
              <div>
                <label htmlFor="principlesHeroEyebrow" className="text-sm font-bold text-brand-ink">
                  Feature eyebrow
                </label>
                <input
                  id="principlesHeroEyebrow"
                  value={value.principlesHeroEyebrow ?? ""}
                  onChange={(event) => update("principlesHeroEyebrow", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="principlesHeroTitle" className="text-sm font-bold text-brand-ink">
                  Feature title
                </label>
                <input
                  id="principlesHeroTitle"
                  value={value.principlesHeroTitle ?? ""}
                  onChange={(event) => update("principlesHeroTitle", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="principlesImage" className="text-sm font-bold text-brand-ink">
                  Feature image URL
                </label>
                <input
                  id="principlesImage"
                  value={value.principlesImage ?? ""}
                  onChange={(event) => update("principlesImage", event.target.value)}
                  className={inputClass}
                  placeholder="https://… or /images/…"
                />
              </div>
              <div>
                <label htmlFor="principlesImageAlt" className="text-sm font-bold text-brand-ink">
                  Feature image alt text
                </label>
                <input
                  id="principlesImageAlt"
                  value={value.principlesImageAlt ?? ""}
                  onChange={(event) => update("principlesImageAlt", event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {value.process !== undefined ? (
            <div>
              <h3 className={subheadingClass}>Process copy</h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="processEyebrow" className="text-sm font-bold text-brand-ink">
                    Process eyebrow
                  </label>
                  <input
                    id="processEyebrow"
                    value={value.processEyebrow ?? ""}
                    onChange={(event) => update("processEyebrow", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="processTitle" className="text-sm font-bold text-brand-ink">
                    Process title
                  </label>
                  <input
                    id="processTitle"
                    value={value.processTitle ?? ""}
                    onChange={(event) => update("processTitle", event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="processDescription" className="text-sm font-bold text-brand-ink">
                    Process description
                  </label>
                  <textarea
                    id="processDescription"
                    value={value.processDescription ?? ""}
                    onChange={(event) => update("processDescription", event.target.value)}
                    className={`${inputClass} h-24`}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <h3 className={subheadingClass}>Next-step copy</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="nextStepEyebrow" className="text-sm font-bold text-brand-ink">
                  Final CTA eyebrow
                </label>
                <input
                  id="nextStepEyebrow"
                  value={value.nextStepEyebrow ?? ""}
                  onChange={(event) => update("nextStepEyebrow", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="nextStepTitle" className="text-sm font-bold text-brand-ink">
                  Final CTA title
                </label>
                <input
                  id="nextStepTitle"
                  value={value.nextStepTitle ?? ""}
                  onChange={(event) => update("nextStepTitle", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="nextStepDescription" className="text-sm font-bold text-brand-ink">
                  Final CTA description
                </label>
                <textarea
                  id="nextStepDescription"
                  value={value.nextStepDescription ?? ""}
                  onChange={(event) => update("nextStepDescription", event.target.value)}
                  className={`${inputClass} h-24`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {value.cohorts !== undefined ? (
        <section className={panelClass}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                Schedule
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Cohorts</h2>
            </div>
            <button
              type="button"
              onClick={() => update("cohorts", [...(value.cohorts ?? []), emptyCohort])}
              className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> Add cohort
            </button>
          </div>
          <div className="space-y-4">
            {(value.cohorts ?? []).map((cohort, index) => (
              <div key={`${cohort.id}-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                {(["id", "name", "startDate", "applicationDeadline", "format", "duration", "location"] as const).map((field) => (
                  <div key={field}>
                    <label className="text-sm font-bold capitalize text-brand-ink">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      value={cohort[field] ?? ""}
                      onChange={(event) => updateCohort(index, { [field]: event.target.value })}
                      className={inputClass}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-bold text-brand-ink">Status</label>
                  <select
                    value={cohort.status}
                    onChange={(event) => updateCohort(index, { status: event.target.value as TrainingCohort["status"] })}
                    className={inputClass}
                  >
                    <option value="open">Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="waitlist">Waitlist</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-brand-ink">Summary</label>
                  <textarea
                    value={cohort.summary}
                    onChange={(event) => updateCohort(index, { summary: event.target.value })}
                    className={`${inputClass} h-24`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => update("cohorts", (value.cohorts ?? []).filter((_, itemIndex) => itemIndex !== index))}
                  className="justify-self-start rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700"
                >
                  <Trash2 className="mr-1 inline h-4 w-4" /> Remove cohort
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {value.process !== undefined ? (
        <section className={panelClass}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                Journey
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Process steps</h2>
            </div>
            <button
              type="button"
              onClick={() => update("process", [...(value.process ?? []), emptyProcessStep])}
              className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> Add step
            </button>
          </div>
          <div className="space-y-4">
            {(value.process ?? []).map((step, index) => (
              <div key={`${step.number}-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-brand-ink">Number</label>
                  <input
                    value={step.number}
                    onChange={(event) => updateProcessStep(index, { number: event.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-brand-ink">Title</label>
                  <input
                    value={step.title}
                    onChange={(event) => updateProcessStep(index, { title: event.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-brand-ink">Icon</label>
                  <input
                    value={step.icon}
                    onChange={(event) => updateProcessStep(index, { icon: event.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-brand-ink">Icon image URL</label>
                  <input
                    value={step.iconImage ?? ""}
                    onChange={(event) => updateProcessStep(index, { iconImage: event.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-brand-ink">Description</label>
                  <textarea
                    value={step.description}
                    onChange={(event) => updateProcessStep(index, { description: event.target.value })}
                    className={`${inputClass} h-24`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => update("process", (value.process ?? []).filter((_, itemIndex) => itemIndex !== index))}
                  className="justify-self-start rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700"
                >
                  <Trash2 className="mr-1 inline h-4 w-4" /> Remove step
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
