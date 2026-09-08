"use client";

import { Check, Eye, EyeOff } from "lucide-react";

import {
  isSectionHiddenFromPage,
  workspaceSections,
} from "@/lib/cms/homepage-sections";
import { cn } from "@/lib/utils/cn";

import { useWorkspace } from "./workspace-provider";

export function SectionRail() {
  const { activeSection, selectSection, isDirty, values } = useWorkspace();

  return (
    <aside
      aria-label="Homepage sections"
      className="h-full min-h-0 overflow-y-auto border-r border-brand-border bg-white p-3"
    >
      <div className="mb-3 flex items-center justify-between px-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
          Page sections
        </p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.62rem] font-bold text-slate-500">
          {workspaceSections.length}
        </span>
      </div>

      <div className="grid gap-1.5">
        {workspaceSections.map((section) => {
          const isActive = section.id === activeSection.id;
          const dirty = isDirty(section.key);
          const hidden = isSectionHiddenFromPage(section.key, values);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => selectSection(section.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex items-start gap-2 rounded-control px-2.5 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                isActive
                  ? "bg-brand-mist text-brand-navy"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span className="mt-0.5 shrink-0">
                {dirty ? (
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                ) : hidden ? (
                  <EyeOff aria-hidden className="h-3 w-3 text-slate-300" />
                ) : (
                  <Check aria-hidden className="h-3 w-3 text-emerald-600" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold leading-4">
                  {section.label}
                </span>
                <span className="mt-0.5 block text-[0.62rem] leading-4 text-slate-400">
                  {dirty
                    ? "Unsaved changes"
                    : hidden
                      ? "Hidden from page"
                      : "Saved"}
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
        <p className="mt-2 flex items-center gap-1.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
          Draft changes
        </p>
        <p className="flex items-center gap-1.5">
          <Check aria-hidden className="h-3 w-3 text-emerald-600" />
          Saved
        </p>
        <p className="flex items-center gap-1.5">
          <EyeOff aria-hidden className="h-3 w-3 text-slate-300" />
          Hidden from page
        </p>
        <p className="mt-3 flex items-center gap-1.5">
          <Eye aria-hidden className="h-3 w-3 text-brand-primary" />
          Click a preview section to edit it
        </p>
      </div>
    </aside>
  );
}
