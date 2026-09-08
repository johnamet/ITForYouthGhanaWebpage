"use client";

import { Loader2, Save } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { useWorkspace } from "./workspace-provider";

/**
 * The single per-section save action. Rendered in both the workspace bar and
 * the editor footer, per the approved design. There is no save-all.
 */
export function SaveSectionButton({ className }: { className?: string }) {
  const { activeSection, isDirty, saveState, save } = useWorkspace();
  const dirty = isDirty(activeSection.key);
  const saving = saveState.status === "saving";

  return (
    <button
      type="button"
      disabled={!dirty || saving}
      onClick={() => save(activeSection.key)}
      className={cn(
        "inline-flex items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-accent-dark disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {saving ? (
        <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Save aria-hidden className="h-3.5 w-3.5" />
      )}
      Save {activeSection.label.toLowerCase()}
    </button>
  );
}
