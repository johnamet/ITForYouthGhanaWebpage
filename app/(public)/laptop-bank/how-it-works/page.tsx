import type { Metadata } from "next";

import { ProcessStepper } from "@/components/laptop-bank/process-stepper";
import { TokenText } from "@/components/laptop-bank/token";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { getProcessStages } from "@/lib/cms/laptop-bank";
import {
  laptopBankHowItWorksContent,
  laptopBankStageSummaryRows,
} from "@/lib/content/laptop-bank-config";

export const metadata: Metadata = {
  title: laptopBankHowItWorksContent.meta.title,
  description: laptopBankHowItWorksContent.meta.description,
};

/**
 * Page 5.2 — /laptop-bank/how-it-works.
 *
 * Four blocks: intro, the nine-row summary table, nine C4 expandables with
 * anchors #stage-1 … #stage-9, and the CTA.
 *
 * The summary table is published from laptopBankStageSummaryRows rather than
 * derived from the Process Stage records, because spec 5.2 block 2 is marked
 * "publish exactly" and labels three of the stages differently from the
 * expandables below. Deriving one from the other would silently normalise the
 * client's two wordings into one.
 */
export default async function LaptopBankHowItWorksRoute() {
  const stages = await getProcessStages();
  const copy = laptopBankHowItWorksContent;

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt={copy.hero.title}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laptop Bank", href: "/laptop-bank" },
          { label: "How it works" },
        ]}
      />

      {/* ── Block 2: the summary table, published exactly ───────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Every stage" title={copy.summaryTableCaption} />

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-border">
                <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Stage
                </th>
                <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Duration
                </th>
                <th scope="col" className="py-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  What you receive
                </th>
              </tr>
            </thead>
            <tbody>
              {laptopBankStageSummaryRows.map((row, index) => (
                <tr key={row.stage} className="border-b border-brand-border/70 align-top">
                  <th scope="row" className="py-4 pr-4 text-sm font-bold text-brand-ink">
                    {/*
                      Each row links to its own expandable below, so the table
                      doubles as navigation into block 3. The anchor index and
                      the row index agree because both lists are the nine
                      stages in stage order.
                    */}
                    <a
                      href={`#stage-${index + 1}`}
                      className="transition hover:text-brand-primary"
                    >
                      {row.stage}
                    </a>
                  </th>
                  <td className="py-4 pr-4 text-sm leading-7 text-slate-600">
                    <TokenText>{row.duration}</TokenText>
                  </td>
                  <td className="py-4 text-sm leading-7 text-slate-600">{row.received}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Block 3: nine expandables, #stage-1 … #stage-9 ─────────────── */}
      <section className="border-y border-brand-border bg-brand-mist/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="In detail"
            title="What happens at each stage, who owns it, and what it produces"
          />
          <ProcessStepper className="mt-10" stages={stages} />
        </div>
      </section>

      {/* ── Block 4: CTA ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Button href={copy.cta.href} variant="solid-pink" size="lg">
          {copy.cta.label}
        </Button>
      </section>
    </div>
  );
}
