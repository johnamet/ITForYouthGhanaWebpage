import Link from "next/link";

import { DonorLogoGrid } from "@/components/laptop-bank/donor-logo-grid";
import { ProcessStepper } from "@/components/laptop-bank/process-stepper";
import { SpecTable, condensedIntakeItems } from "@/components/laptop-bank/spec-table";
import { StatBand } from "@/components/laptop-bank/stat-band";
import { StickyMobileCta } from "@/components/laptop-bank/sticky-mobile-cta";
import { TokenText } from "@/components/laptop-bank/token";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { ProseMediaCardGrid } from "@/components/shared/prose-media-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { laptopBankLandingContent, type LaptopBankCard } from "@/lib/content/laptop-bank-config";
import type { Donor, DashboardMetrics, IntakeItem, ProcessStage } from "@/types/laptop-bank";

type LaptopBankLandingPageProps = {
  stages: ProcessStage[];
  intakeItems: IntakeItem[];
  metrics: DashboardMetrics | null;
  logoDonors: Donor[];
};

/** Spec 5.1 block 7: "Hide when fewer than 4 records." */
const MINIMUM_PARTNER_LOGOS = 4;

function toCards(cards: LaptopBankCard[], keyPrefix: string) {
  return cards.map((card) => ({
    title: card.title,
    body: card.body,
    href: card.href,
    mediaKey: `${keyPrefix}-${card.title}`,
  }));
}

/**
 * Page 5.1 — /laptop-bank.
 *
 * Nine blocks in the spec's order. C1 is the site's existing
 * EditorialImageHero and C7 is its existing ProseMediaCardGrid: spec §3 says
 * build once and reuse with no page-specific duplicates, and this site already
 * had both primitives.
 *
 * Tone, per Draft 1 §4: operational and precise. No appeals to sympathy
 * anywhere on this page — that is Her First Laptop's job. This page sells
 * competence.
 */
export function LaptopBankLandingPage({
  stages,
  intakeItems,
  metrics,
  logoDonors,
}: LaptopBankLandingPageProps) {
  const copy = laptopBankLandingContent;
  const showPartners = logoDonors.length >= MINIMUM_PARTNER_LOGOS;

  return (
    <div className="bg-white">
      {/* ── Block 1: hero (C1) ─────────────────────────────────────────── */}
      {/*
        No hero image. Draft 1 §4 §1 is specific about what belongs here — "a
        workbench with laptops open and under test, or a technician holding a
        drive" — and explicitly rules out a smiling group photo because it
        signals a charity appeal and undercuts the operational tone. No such
        photograph exists in lib/content/media-pool.ts, and Draft 1 §15 lists
        the workbench and testing shots as blocking content still owed by
        Communications. Substituting a training-lab photograph would imply it
        depicts this facility. EditorialImageHero renders its panel on a navy
        ground when imageSrc is absent, so pass the photograph here once it
        arrives.
      */}
      <EditorialImageHero
        imageAlt={copy.hero.heading}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.heading}
        description={copy.hero.subheading}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Laptop Bank" }]}
        ctas={[
          { label: copy.hero.primaryCta.label, href: copy.hero.primaryCta.href },
          // Spec 5.1 BEHAVIOUR: "Corporate pack download requires no email
          // address." This is a plain link to the documents page, with no form
          // in front of it. Spec §10 checks exactly that.
          { label: copy.hero.secondaryCta.label, href: copy.hero.secondaryCta.href, variant: "secondary" },
        ]}
        priority
      />

      {/* ── Block 2: stat band (C2) ────────────────────────────────────── */}
      {/* Hides itself while any metric or the last-updated date is missing. */}
      <StatBand metrics={metrics} />

      {/* ── Block 3: what we handle for you (C7, 4 cards) ──────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={copy.handleForYou.eyebrow}
          title={copy.handleForYou.title}
        />
        <ProseMediaCardGrid
          className="mt-10"
          cards={toCards(copy.handleForYou.cards, "handle")}
          theme="corporate"
          columns={2}
        />
      </section>

      {/* ── Block 4: the process, 9 stages (C3, summary only) ──────────── */}
      <section className="border-y border-brand-border bg-brand-mist/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={copy.process.eyebrow} title={copy.process.title} />
          <ProcessStepper className="mt-10" stages={stages} summaryOnly />
          <Link
            href={copy.process.link.href}
            className="mt-8 inline-flex text-sm font-bold text-brand-primary transition hover:text-brand-ink"
          >
            {copy.process.link.label}
          </Link>
        </div>
      </section>

      {/* ── Block 5: where the machines go (C7, 3 cards) ───────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={copy.whereMachinesGo.eyebrow}
          title={copy.whereMachinesGo.title}
        />
        {/*
          theme="youth" rather than "corporate" so this grid does not repeat
          block 3's photographs. Checked against lib/content/media-pool.ts:
          the corporate and youth pools share no entries, local or Unsplash.
          Per ProseMediaCardGrid's own doc, two differently-named themes are
          not automatically disjoint — several pairs overlap heavily — so this
          was verified rather than assumed.
        */}
        <ProseMediaCardGrid
          className="mt-10"
          cards={toCards(copy.whereMachinesGo.cards, "destination")}
          theme="youth"
          columns={3}
        />
      </section>

      {/* ── Block 6: what we accept (C5, condensed) ────────────────────── */}
      <section className="border-t border-brand-border bg-brand-mist/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={copy.whatWeAccept.eyebrow} title={copy.whatWeAccept.title} />
          <SpecTable className="mt-10" items={condensedIntakeItems(intakeItems)} condensed />
          <Link
            href={copy.whatWeAccept.link.href}
            className="mt-8 inline-flex text-sm font-bold text-brand-primary transition hover:text-brand-ink"
          >
            {copy.whatWeAccept.link.label}
          </Link>
        </div>
      </section>

      {/* ── Block 7: partners (C9) — Phase 2, ≥4 consenting logos ──────── */}
      {showPartners ? (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={copy.partners.eyebrow} title={copy.partners.title} />
          <DonorLogoGrid className="mt-10" donors={logoDonors} />
        </section>
      ) : null}

      {/* ── Block 8: closing CTA (C1 variant) ─────────────────────────── */}
      <section className="bg-brand-navy">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            {copy.closing.heading}
          </h2>
          <p className="mt-5 text-base leading-8 text-white/80">
            <TokenText>{copy.closing.body}</TokenText>
          </p>
          <div className="mt-8 flex justify-center">
            <Button href={copy.closing.cta.href} variant="solid-pink" size="lg">
              {copy.closing.cta.label}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Block 9: sticky mobile CTA (C14) ──────────────────────────── */}
      <StickyMobileCta label={copy.stickyCta.label} href={copy.stickyCta.href} />
    </div>
  );
}
