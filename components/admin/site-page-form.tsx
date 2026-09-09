"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Save } from "lucide-react";

import type { EditableSitePage } from "@/types/content";

import { BodySectionsRegion } from "./site-page/body-sections-region";
import { CtasRegion } from "./site-page/ctas-region";
import { HeroRegion } from "./site-page/hero-region";
import { OtherFieldsRegion } from "./site-page/other-fields-region";
import { RelatedRegion } from "./site-page/related-region";
import { SettingsRegion } from "./site-page/settings-region";
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

      <HeroRegion value={values} onChange={setValues} />
      <CtasRegion value={values} onChange={setValues} />
      <StatsRegion value={values} onChange={setValues} />
      <BodySectionsRegion value={values} onChange={setValues} />
      <RelatedRegion value={values} onChange={setValues} />
      <SettingsRegion
        value={values}
        onChange={setValues}
        showSlugField={showSlugField}
        showPublishingFields={showPublishingFields}
        slugBasePath={slugBasePath}
      />
      <OtherFieldsRegion value={values} onChange={setValues} />

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
