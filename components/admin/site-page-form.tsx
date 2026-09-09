"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import type {
  DynamicSitePage,
  EditableSitePage,
  TrainingCohort,
  TrainingProcessStep,
} from "@/types/content";

import { BodySectionsRegion } from "./site-page/body-sections-region";
import { CtasRegion } from "./site-page/ctas-region";
import { RelatedRegion } from "./site-page/related-region";
import {
  emptyCohort,
  emptyProcessStep,
  inputClass,
  panelClass,
} from "./site-page/shared";
import { StatsRegion } from "./site-page/stats-region";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type SitePageFormProps = {
  initial: EditableSitePage;
  endpoint: string;
  previewHref: string;
  submitLabel?: string;
  method?: "POST" | "PUT";
  showSlugField?: boolean;
  showPublishingFields?: boolean;
  slugBasePath?: string;
  successRedirectHref?: string;
};

export function SitePageForm({
  initial,
  endpoint,
  previewHref,
  submitLabel = "Save page",
  method = "PUT",
  showSlugField = false,
  showPublishingFields = false,
  slugBasePath = "/who-we-are",
  successRedirectHref,
}: SitePageFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<EditableSitePage>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const update = <Key extends keyof EditableSitePage>(
    key: Key,
    value: EditableSitePage[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateCohort = (index: number, patch: Partial<TrainingCohort>) =>
    update("cohorts", (values.cohorts ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const updateProcessStep = (index: number, patch: Partial<TrainingProcessStep>) =>
    update("process", (values.process ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not save this page right now.");
      }

      setSubmitState({
        type: "success",
        message: payload.message || "Page saved.",
      });
      if (successRedirectHref) {
        router.push(successRedirectHref);
      } else {
        router.refresh();
      }
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save this page right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {submitState.type !== "idle" ? (
        <div
          className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${
            submitState.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {submitState.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5" />
          )}
          <span>{submitState.message}</span>
        </div>
      ) : null}

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
          {showSlugField ? (
            <div>
              <label htmlFor="slug" className="text-sm font-bold text-brand-ink">
                URL slug
              </label>
              <input
                id="slug"
                required
                value={values.slug}
                onChange={(event) => update("slug", event.target.value)}
                className={inputClass}
                placeholder="board-of-directors"
              />
              <p className="mt-2 text-xs font-medium text-slate-500">
                This becomes {slugBasePath}/{values.slug || "your-slug"}.
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
                  value={"status" in values ? values.status : "draft"}
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
                  value={"order" in values ? values.order : 0}
                  onChange={(event) => update("order", Number(event.target.value))}
                  className={inputClass}
                />
              </div>
            </>
          ) : null}
          <div>
            <label htmlFor="eyebrow" className="text-sm font-bold text-brand-ink">
              Eyebrow
            </label>
            <input
              id="eyebrow"
              value={values.eyebrow}
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
              value={values.title}
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
              value={values.description}
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
              value={values.intro}
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
              value={values.heroImage ?? ""}
              onChange={(event) => update("heroImage", event.target.value)}
              className={inputClass}
              placeholder="/images/randomPictures/groupworkstudents.jpg"
            />
          </div>
          <div>
            <label htmlFor="heroVideoUrl" className="text-sm font-bold text-brand-ink">
              Hero video URL (optional)
            </label>
            <input
              id="heroVideoUrl"
              value={values.heroVideoUrl ?? ""}
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
              value={values.heroVideoThumbnail ?? ""}
              onChange={(event) => update("heroVideoThumbnail", event.target.value)}
              className={inputClass}
              placeholder="/images/… or https://…"
            />
          </div>
        </div>
      </section>

      {values.cohorts !== undefined ? (
        <section className={panelClass}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">Schedule</p><h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Cohorts</h2></div>
            <button type="button" onClick={() => update("cohorts", [...(values.cohorts ?? []), emptyCohort])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Add cohort</button>
          </div>
          <div className="space-y-4">{(values.cohorts ?? []).map((cohort, index) => (
            <div key={`${cohort.id}-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              {(["id", "name", "startDate", "applicationDeadline", "format", "duration", "location"] as const).map((field) => <div key={field}><label className="text-sm font-bold capitalize text-brand-ink">{field.replace(/([A-Z])/g, " $1")}</label><input value={cohort[field] ?? ""} onChange={(event) => updateCohort(index, { [field]: event.target.value })} className={inputClass} /></div>)}
              <div><label className="text-sm font-bold text-brand-ink">Status</label><select value={cohort.status} onChange={(event) => updateCohort(index, { status: event.target.value as TrainingCohort["status"] })} className={inputClass}><option value="open">Open</option><option value="upcoming">Upcoming</option><option value="waitlist">Waitlist</option></select></div>
              <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Summary</label><textarea value={cohort.summary} onChange={(event) => updateCohort(index, { summary: event.target.value })} className={`${inputClass} h-24`} /></div>
              <button type="button" onClick={() => update("cohorts", (values.cohorts ?? []).filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700"><Trash2 className="mr-1 inline h-4 w-4" /> Remove cohort</button>
            </div>
          ))}</div>
        </section>
      ) : null}

      {values.process !== undefined ? (
        <section className={panelClass}>
          <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">Journey</p><h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Process steps</h2></div><button type="button" onClick={() => update("process", [...(values.process ?? []), emptyProcessStep])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Add step</button></div>
          <div className="space-y-4">{(values.process ?? []).map((step, index) => <div key={`${step.number}-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2"><div><label className="text-sm font-bold text-brand-ink">Number</label><input value={step.number} onChange={(event) => updateProcessStep(index, { number: event.target.value })} className={inputClass} /></div><div><label className="text-sm font-bold text-brand-ink">Title</label><input value={step.title} onChange={(event) => updateProcessStep(index, { title: event.target.value })} className={inputClass} /></div><div><label className="text-sm font-bold text-brand-ink">Icon</label><input value={step.icon} onChange={(event) => updateProcessStep(index, { icon: event.target.value })} className={inputClass} /></div><div><label className="text-sm font-bold text-brand-ink">Icon image URL</label><input value={step.iconImage ?? ""} onChange={(event) => updateProcessStep(index, { iconImage: event.target.value })} className={inputClass} /></div><div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><textarea value={step.description} onChange={(event) => updateProcessStep(index, { description: event.target.value })} className={`${inputClass} h-24`} /></div><button type="button" onClick={() => update("process", (values.process ?? []).filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700"><Trash2 className="mr-1 inline h-4 w-4" /> Remove step</button></div>)}</div>
        </section>
      ) : null}

      <section className={panelClass}>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            Page sections
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
            Optional heading copy
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            These fields let each public page rename major sections without changing code. Empty
            fields fall back to the page design defaults.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="overviewTitle" className="text-sm font-bold text-brand-ink">
              Overview title
            </label>
            <input
              id="overviewTitle"
              value={values.overviewTitle ?? ""}
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
              value={values.overviewDescription ?? ""}
              onChange={(event) => update("overviewDescription", event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="operatingEyebrow" className="text-sm font-bold text-brand-ink">
              Second section eyebrow
            </label>
            <input
              id="operatingEyebrow"
              value={values.operatingEyebrow ?? ""}
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
              value={values.operatingTitle ?? ""}
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
              value={values.operatingDescription ?? ""}
              onChange={(event) => update("operatingDescription", event.target.value)}
              className={`${inputClass} h-24`}
            />
          </div>
          <div>
            <label htmlFor="principlesEyebrow" className="text-sm font-bold text-brand-ink">
              Third section eyebrow
            </label>
            <input
              id="principlesEyebrow"
              value={values.principlesEyebrow ?? ""}
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
              value={values.principlesTitle ?? ""}
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
              value={values.principlesDescription ?? ""}
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
              value={values.principlesHeroEyebrow ?? ""}
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
              value={values.principlesHeroTitle ?? ""}
              onChange={(event) => update("principlesHeroTitle", event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="principlesImage" className="text-sm font-bold text-brand-ink">Feature image URL</label>
            <input id="principlesImage" value={values.principlesImage ?? ""} onChange={(event) => update("principlesImage", event.target.value)} className={inputClass} placeholder="https://… or /images/…" />
          </div>
          <div>
            <label htmlFor="principlesImageAlt" className="text-sm font-bold text-brand-ink">Feature image alt text</label>
            <input id="principlesImageAlt" value={values.principlesImageAlt ?? ""} onChange={(event) => update("principlesImageAlt", event.target.value)} className={inputClass} />
          </div>
          {values.process !== undefined ? (
            <>
              <div>
                <label htmlFor="processEyebrow" className="text-sm font-bold text-brand-ink">Process eyebrow</label>
                <input id="processEyebrow" value={values.processEyebrow ?? ""} onChange={(event) => update("processEyebrow", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="processTitle" className="text-sm font-bold text-brand-ink">Process title</label>
                <input id="processTitle" value={values.processTitle ?? ""} onChange={(event) => update("processTitle", event.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="processDescription" className="text-sm font-bold text-brand-ink">Process description</label>
                <textarea id="processDescription" value={values.processDescription ?? ""} onChange={(event) => update("processDescription", event.target.value)} className={`${inputClass} h-24`} />
              </div>
            </>
          ) : null}
          <div>
            <label htmlFor="nextStepEyebrow" className="text-sm font-bold text-brand-ink">Final CTA eyebrow</label>
            <input id="nextStepEyebrow" value={values.nextStepEyebrow ?? ""} onChange={(event) => update("nextStepEyebrow", event.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="nextStepTitle" className="text-sm font-bold text-brand-ink">Final CTA title</label>
            <input id="nextStepTitle" value={values.nextStepTitle ?? ""} onChange={(event) => update("nextStepTitle", event.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="nextStepDescription" className="text-sm font-bold text-brand-ink">Final CTA description</label>
            <textarea id="nextStepDescription" value={values.nextStepDescription ?? ""} onChange={(event) => update("nextStepDescription", event.target.value)} className={`${inputClass} h-24`} />
          </div>
        </div>
      </section>

      <StatsRegion value={values} onChange={setValues} />
      <BodySectionsRegion value={values} onChange={setValues} />
      <CtasRegion value={values} onChange={setValues} />
      <RelatedRegion value={values} onChange={setValues} />

      <div className="flex flex-wrap items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitLabel}
        </button>
        <Link
          href={previewHref}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist"
        >
          <ExternalLink className="h-4 w-4" />
          Preview
        </Link>
      </div>
    </form>
  );
}
