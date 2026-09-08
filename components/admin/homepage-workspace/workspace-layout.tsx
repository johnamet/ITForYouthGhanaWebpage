"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

import { SectionEditor } from "./section-editor";
import { SectionRail } from "./section-rail";
import { WorkspaceBar } from "./workspace-bar";

export function WorkspaceLayout({ preview }: { preview?: React.ReactNode }) {
  const [view, setView] = useState<"edit" | "preview">("edit");

  return (
    <div className="flex h-screen flex-col">
      <WorkspaceBar />

      {/* Below xl the panes would both be unusable, so switch instead. */}
      <div className="shrink-0 border-b border-slate-200 bg-white p-3 xl:hidden">
        <div
          role="tablist"
          aria-label="Editor view"
          className="grid grid-cols-2 rounded-media bg-slate-100 p-1"
        >
          {(["edit", "preview"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={view === option}
              onClick={() => setView(option)}
              className={cn(
                "rounded-control px-4 py-2 text-sm font-bold capitalize transition",
                view === option
                  ? "bg-white shadow-sm text-brand-ink"
                  : "text-slate-500",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* The grid gets a definite height from flex-1 + min-h-0 inside h-screen,
          and its items stretch to the row. Each pane root carries h-full so
          that height reaches the scrolling element itself. */}
      <div className="grid min-h-0 flex-1 xl:grid-cols-[176px_392px_minmax(520px,1fr)] 2xl:grid-cols-[196px_430px_minmax(580px,1fr)]">
        {/* Below xl the rail stacks above the editor in the Edit tab. It must
            stay reachable: it is the only way to change section, so hiding it
            outright would strand narrow-viewport editors on one section. */}
        <div
          className={cn(
            "min-h-0",
            view === "edit" ? "block" : "hidden",
            "xl:block",
          )}
        >
          <SectionRail />
        </div>

        <div
          className={cn(
            "min-h-0",
            view === "edit" ? "block" : "hidden",
            "xl:block",
          )}
        >
          <SectionEditor />
        </div>

        <div
          className={cn(
            "min-h-0",
            view === "preview" ? "block" : "hidden",
            "xl:block",
          )}
        >
          {preview}
        </div>
      </div>
    </div>
  );
}
