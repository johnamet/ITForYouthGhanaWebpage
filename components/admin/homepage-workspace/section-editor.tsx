"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

import {
  ChallengeSectionForm,
  MissionSectionForm,
  OverviewSectionForm,
} from "@/components/admin/homepage-narrative-forms";
import { JoinCtaCardsForm } from "@/components/admin/join-cta-cards-form";
import { NewsletterForm } from "@/components/admin/newsletter-form";
import { ProgrammeShowcaseForm } from "@/components/admin/programme-showcase-form";
import { TickerForm } from "@/components/admin/ticker-form";

import { SaveSectionButton } from "./save-section-button";
import { useWorkspace } from "./workspace-provider";

function ActiveForm() {
  const { activeSection, values, setValue } = useWorkspace();

  // Exhaustive over HomepageSectionKey — TypeScript fails the build if a
  // section key is added to the registry without a form here.
  switch (activeSection.key) {
    case "overviewSection":
      return (
        <OverviewSectionForm
          value={values.overviewSection}
          onChange={(next) => setValue("overviewSection", next)}
        />
      );
    case "challengeSection":
      return (
        <ChallengeSectionForm
          value={values.challengeSection}
          onChange={(next) => setValue("challengeSection", next)}
        />
      );
    case "missionSection":
      return (
        <MissionSectionForm
          value={values.missionSection}
          onChange={(next) => setValue("missionSection", next)}
        />
      );
    case "ticker":
      return (
        <TickerForm
          value={values.ticker}
          onChange={(next) => setValue("ticker", next)}
        />
      );
    case "programmeShowcase":
      return (
        <ProgrammeShowcaseForm
          value={values.programmeShowcase}
          onChange={(next) => setValue("programmeShowcase", next)}
        />
      );
    case "joinCtaCards":
      return (
        <JoinCtaCardsForm
          value={values.joinCtaCards}
          onChange={(next) => setValue("joinCtaCards", next)}
        />
      );
    case "newsletterSignup":
      return (
        <NewsletterForm
          value={values.newsletterSignup}
          onChange={(next) => setValue("newsletterSignup", next)}
        />
      );
  }
}

export function SectionEditor() {
  const { activeSection, isDirty, saveState } = useWorkspace();
  const dirty = isDirty(activeSection.key);

  return (
    <section
      aria-labelledby="workspace-editor-title"
      className="h-full min-h-0 overflow-y-auto border-r border-slate-200 bg-brand-alt"
    >
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-primary">
          Homepage section
        </p>
        <h2
          id="workspace-editor-title"
          className="mt-1 font-heading text-2xl font-bold text-brand-ink"
        >
          {activeSection.label}
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {activeSection.description}
        </p>
      </div>

      <div className="space-y-5 p-5">
        <ActiveForm />

        {saveState.status === "error" ? (
          <div className="flex items-start gap-3 rounded-media border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            <AlertCircle aria-hidden className="mt-0.5 h-5 w-5" />
            <span>{saveState.message}</span>
          </div>
        ) : null}

        {saveState.status === "saved" ? (
          <div className="flex items-start gap-3 rounded-media border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5" />
            <span>{saveState.message}</span>
          </div>
        ) : null}

        <div className="sticky bottom-3 flex items-center justify-between rounded-media border border-brand-border bg-white/95 p-3 shadow-sm backdrop-blur">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold text-slate-500">
            {dirty ? (
              <>
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brand-accent"
                />
                <span className="text-brand-accent">Not saved</span>
              </>
            ) : (
              "No unsaved changes"
            )}
          </span>
          <SaveSectionButton />
        </div>
      </div>
    </section>
  );
}
