"use client";

import { ChevronRight, ExternalLink } from "lucide-react";

import { SaveSectionButton } from "./save-section-button";
import { useWorkspace } from "./workspace-provider";

export function WorkspaceBar() {
  const { activeSection, isDirty } = useWorkspace();
  const dirty = isDirty(activeSection.key);

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-slate-400"
          >
            <span>Content</span>
            <ChevronRight aria-hidden className="h-3 w-3" />
            <span>Homepage</span>
            <ChevronRight aria-hidden className="h-3 w-3" />
            <span className="text-brand-primary">{activeSection.label}</span>
          </nav>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-brand-ink">
              Edit homepage
            </h1>
            {dirty ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-warm px-3 py-1 text-xs font-bold text-brand-accent">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brand-accent"
                />
                Unsaved changes
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-control border border-brand-border px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            Open public page
          </a>
          <SaveSectionButton />
        </div>
      </div>
    </header>
  );
}
