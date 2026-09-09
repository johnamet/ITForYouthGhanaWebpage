"use client";

import { AlertCircle } from "lucide-react";

import { BodySectionsRegion } from "@/components/admin/site-page/body-sections-region";
import { CtasRegion } from "@/components/admin/site-page/ctas-region";
import { HeroRegion } from "@/components/admin/site-page/hero-region";
import { OtherFieldsRegion } from "@/components/admin/site-page/other-fields-region";
import { RelatedRegion } from "@/components/admin/site-page/related-region";
import { SettingsRegion } from "@/components/admin/site-page/settings-region";
import { StatsRegion } from "@/components/admin/site-page/stats-region";

import { useSitePageWorkspace } from "./record-provider";

function ActiveRegion() {
  const { activeRegion, draft, setDraft, family } = useSitePageWorkspace();
  const props = { value: draft, onChange: setDraft };

  // Exhaustive over SitePageRegionId — TypeScript fails the build if a
  // region is added to the registry without an editor here. No default
  // branch: that is what makes the omission a build failure rather than a
  // silent gap.
  switch (activeRegion.id) {
    case "hero":
      return <HeroRegion {...props} />;
    case "ctas":
      return <CtasRegion {...props} />;
    case "stats":
      return <StatsRegion {...props} />;
    case "body":
      return <BodySectionsRegion {...props} />;
    case "related":
      return <RelatedRegion {...props} />;
    case "settings":
      // slugBasePath is not optional in practice: without it the slug helper
      // text says "/who-we-are" on a What We Do page, telling the editor the
      // wrong address at the moment they are choosing it. The family
      // descriptor carries publicBase for exactly this.
      return <SettingsRegion {...props} slugBasePath={family.publicBase} />;
    case "other":
      return <OtherFieldsRegion {...props} />;
  }
}

export function RegionEditor() {
  const { activeRegion, regionErrors } = useSitePageWorkspace();
  const errors = regionErrors[activeRegion.id] ?? [];

  return (
    <section
      aria-labelledby="workspace-editor-title"
      className="h-full min-h-0 overflow-y-auto border-r border-slate-200 bg-brand-alt"
    >
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-primary">
          Page region
        </p>
        <h2
          id="workspace-editor-title"
          className="mt-1 font-heading text-2xl font-bold text-brand-ink"
        >
          {activeRegion.label}
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {activeRegion.description}
        </p>
      </div>

      <div className="space-y-5 p-5">
        <ActiveRegion />

        {errors.length > 0 ? (
          <div className="flex items-start gap-3 rounded-media border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            <AlertCircle aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
            <ul className="space-y-1">
              {errors.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
