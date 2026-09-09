"use client";

import { ChevronRight, ExternalLink, Loader2, Save } from "lucide-react";

import { useSitePageWorkspace } from "./record-provider";

export function SitePageWorkspaceBar() {
  const {
    family,
    published,
    activeRegion,
    isDirty,
    canSave,
    saveState,
    regionErrors,
    formErrors,
    save,
  } = useSitePageWorkspace();

  const saving = saveState.status === "saving";
  const title = published.title || published.slug;
  // Deliberately derived from regionErrors rather than shown as a bare count
  // on the disabled button: a disabled save button says something is wrong
  // but not where, and this count keeps the bar honest about why saving is
  // blocked.
  const errorRegionCount = Object.values(regionErrors).filter(
    (messages) => (messages?.length ?? 0) > 0,
  ).length;

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-slate-400"
          >
            <span>{family.label}</span>
            <ChevronRight aria-hidden className="h-3 w-3" />
            <span>{title}</span>
            <ChevronRight aria-hidden className="h-3 w-3" />
            <span className="text-brand-primary">{activeRegion.label}</span>
          </nav>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-brand-ink">
              {title}
            </h1>
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-warm px-3 py-1 text-xs font-bold text-brand-accent">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brand-accent"
                />
                Unsaved changes
              </span>
            ) : null}
          </div>

          {/* Page-level errors belong to no single region, so they render
              here rather than inside a region's pane — attributing them to
              a region would misrepresent where the problem is. */}
          {formErrors.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs font-semibold text-rose-600">
              {formErrors.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {isDirty && !canSave ? (
            <span className="text-xs font-bold text-rose-600">
              {errorRegionCount} region(s) need attention
            </span>
          ) : null}
          <a
            href={`${family.publicBase}/${published.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-control border border-brand-border px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            Open public page
          </a>
          <button
            type="button"
            disabled={!canSave || saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save aria-hidden className="h-3.5 w-3.5" />
            )}
            Save page
          </button>
        </div>
      </div>
    </header>
  );
}
