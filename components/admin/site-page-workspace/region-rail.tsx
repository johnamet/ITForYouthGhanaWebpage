"use client";

import type { ReactNode } from "react";

import { AlertCircle, Check, EyeOff, Minus } from "lucide-react";

import {
  isRegionEmpty,
  sitePageRegions,
  type SitePageRegion,
  type SitePageRegionId,
} from "@/lib/cms/site-page-regions";
import { cn } from "@/lib/utils/cn";
import type { EditableSitePage } from "@/types/content";

import { useSitePageWorkspace } from "./record-provider";

type RegionStatus = "error" | "unsaved" | "not-shown" | "empty" | "saved";

/**
 * Precedence order matters: a region you cannot save (error) outranks one
 * you simply have not saved yet (unsaved), which outranks the descriptive
 * states (not-shown, empty, saved).
 */
function regionStatus(
  region: SitePageRegion,
  draft: EditableSitePage,
  dirtyRegions: ReadonlySet<SitePageRegionId>,
  regionErrors: Partial<Record<SitePageRegionId, string[]>>,
): RegionStatus {
  if ((regionErrors[region.id]?.length ?? 0) > 0) {
    return "error";
  }
  if (dirtyRegions.has(region.id)) {
    return "unsaved";
  }
  if (region.previewTarget === null) {
    return "not-shown";
  }
  if (isRegionEmpty(region, draft)) {
    return "empty";
  }
  return "saved";
}

const REGION_STATUS_META: Record<
  RegionStatus,
  { label: string; icon: () => ReactNode }
> = {
  error: {
    label: "Needs attention",
    icon: () => <AlertCircle aria-hidden className="h-3 w-3 text-rose-600" />,
  },
  unsaved: {
    label: "Unsaved changes",
    icon: () => (
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full bg-brand-accent"
      />
    ),
  },
  "not-shown": {
    label: "Not shown on this page",
    icon: () => <EyeOff aria-hidden className="h-3 w-3 text-slate-300" />,
  },
  empty: {
    label: "Nothing added yet",
    icon: () => <Minus aria-hidden className="h-3 w-3 text-slate-300" />,
  },
  saved: {
    label: "Saved",
    icon: () => <Check aria-hidden className="h-3 w-3 text-emerald-600" />,
  },
};

export function RegionRail() {
  const { activeRegion, selectRegion, draft, dirtyRegions, regionErrors } =
    useSitePageWorkspace();

  return (
    <aside
      aria-label="Page regions"
      className="h-full min-h-0 overflow-y-auto border-r border-brand-border bg-white p-3"
    >
      <div className="mb-3 flex items-center justify-between px-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
          Page regions
        </p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.62rem] font-bold text-slate-500">
          {sitePageRegions.length}
        </span>
      </div>

      <div className="grid gap-1.5">
        {sitePageRegions.map((region) => {
          const isActive = region.id === activeRegion.id;
          const status = regionStatus(region, draft, dirtyRegions, regionErrors);
          const meta = REGION_STATUS_META[status];

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => selectRegion(region.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex items-start gap-2 rounded-control px-2.5 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                isActive
                  ? "bg-brand-mist text-brand-navy"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span className="mt-0.5 shrink-0">{meta.icon()}</span>
              <span className="min-w-0">
                <span className="block text-xs font-bold leading-4">
                  {region.label}
                </span>
                <span className="mt-0.5 block text-[0.62rem] leading-4 text-slate-400">
                  {meta.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-slate-100 px-2 pt-4 text-[0.63rem] leading-5 text-slate-400">
        <p className="font-bold uppercase tracking-[0.16em] text-slate-500">
          Status
        </p>
        {(
          Object.entries(REGION_STATUS_META) as [
            RegionStatus,
            (typeof REGION_STATUS_META)[RegionStatus],
          ][]
        ).map(([key, meta]) => (
          <p key={key} className="mt-2 flex items-center gap-1.5">
            {meta.icon()}
            {meta.label}
          </p>
        ))}
      </div>
    </aside>
  );
}
