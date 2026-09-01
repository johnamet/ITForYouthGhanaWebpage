import Link from "next/link";

import { ExpandableSection } from "@/components/laptop-bank/expandable-section";
import { TokenText } from "@/components/laptop-bank/token";
import { cn } from "@/lib/utils/cn";
import type { ProcessStage } from "@/types/laptop-bank";

type ProcessStepperProps = {
  stages: ProcessStage[];
  /**
   * Page 5.1 block 4: "Summary sentence only." Renders the condensed rail with
   * no expandables, because the detail lives on /laptop-bank/how-it-works.
   */
  summaryOnly?: boolean;
  className?: string;
};

/** `#stage-1` … `#stage-9`. Spec §10 checks all nine resolve. */
export function stageAnchor(stage: ProcessStage): string {
  return `stage-${stage.number}`;
}

/**
 * C3 — the nine-stage process stepper.
 *
 * Spec §3: "Horizontal on ≥1024px, vertical accordion below. One anchor per
 * stage: #stage-1 … #stage-9. Reads Process Stage content type."
 *
 * The horizontal rail and the vertical list render from the same `stages`
 * array. Above lg the rail is a row of numbered nodes that link to their own
 * anchors; below lg the rail is hidden and the stages read as a stacked
 * accordion. In full mode both are present — the rail is navigation, the
 * accordion is the content it navigates to — so a desktop reader clicking node
 * 5 lands on and opens #stage-5.
 */
export function ProcessStepper({ stages, summaryOnly = false, className }: ProcessStepperProps) {
  if (!stages.length) return null;

  return (
    <div className={cn("space-y-8", className)}>
      {/* ≥1024px: the horizontal rail. */}
      <ol className="hidden lg:grid lg:grid-cols-9 lg:gap-2">
        {stages.map((stage) => (
          <li key={stage.number} className="relative">
            <Link
              href={`#${stageAnchor(stage)}`}
              className="group block rounded-2xl px-2 py-3 transition hover:bg-brand-mist/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                {stage.number}
              </span>
              <span className="mt-3 block text-xs font-bold leading-5 text-brand-ink group-hover:text-brand-primary">
                {stage.title}
              </span>
              <span className="mt-1 block text-[0.68rem] leading-5 text-slate-500">
                <TokenText>{stage.duration}</TokenText>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {summaryOnly ? (
        /* Page 5.1: the summary sentence for each stage, no expandables. */
        <ol className="space-y-4 lg:hidden">
          {stages.map((stage) => (
            <li key={stage.number} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                {stage.number}
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-brand-ink">{stage.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  <TokenText>{stage.summary_sentence}</TokenText>
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        /* Page 5.2 block 3: one expandable per stage, at every width. */
        <div className="space-y-4">
          {stages.map((stage) => (
            <ExpandableSection
              key={stage.number}
              id={stageAnchor(stage)}
              title={`${stage.number}. ${stage.title}`}
              footer={
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Owner</p>
                    <p className="mt-1 text-sm leading-7 text-slate-600">{stage.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                      Record produced
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-600">{stage.record_produced}</p>
                  </div>
                </div>
              }
            >
              <TokenText>{stage.full_text}</TokenText>
            </ExpandableSection>
          ))}
        </div>
      )}
    </div>
  );
}
