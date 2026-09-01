import type { Metadata } from "next";
import Link from "next/link";

import { GivingMechanic } from "@/components/laptop-bank/giving-mechanic";
import { StoryCard } from "@/components/laptop-bank/story-card";
import { StickyMobileCta } from "@/components/laptop-bank/sticky-mobile-cta";
import { TokenText } from "@/components/laptop-bank/token";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { ProseMediaCardGrid } from "@/components/shared/prose-media-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublishableStories } from "@/lib/cms/laptop-bank";
import { herFirstLaptopContent } from "@/lib/content/her-first-laptop-config";

export const metadata: Metadata = {
  title: herFirstLaptopContent.meta.title,
  description: herFirstLaptopContent.meta.description,
};

/**
 * Page 5.6 — /her-first-laptop.
 *
 * Nine blocks in the spec's order. Tone, per Draft 1 §8: warm, specific and
 * free of pity — the subject of every sentence is what she is doing, not what
 * she lacks. This is the one page in this programme that is allowed to appeal
 * to feeling; /laptop-bank sells competence instead.
 */
export default async function HerFirstLaptopRoute() {
  const copy = herFirstLaptopContent;
  // Block 6 is Phase 2 and hides when no consented record exists. The query
  // has already excluded anything without publication_consent.
  const [story] = await getPublishableStories(1);

  return (
    <div className="bg-white">
      {/* ── Block 1: hero (C1) ─────────────────────────────────────────── */}
      {/*
        Draft 1 §8 §1: "a young woman working at a laptop, looking at her
        screen rather than at the camera. Real photograph with signed consent.
        No stock imagery of anonymous African students; donors recognise it
        instantly and it costs you credibility." Consented recipient portraits
        are listed in Draft 1 §15 as content still owed, and the pool holds no
        photograph that meets that bar, so the hero ships without one rather
        than with stock.

        Both CTAs sit inside the hero panel, which is what keeps the student
        link in the mobile viewport without scrolling — spec 5.6 BEHAVIOUR
        requires exactly that, and it is the reason this page exists at all.
      */}
      <EditorialImageHero
        imageAlt={copy.hero.heading}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.heading}
        description={copy.hero.subheading}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Her First Laptop" }]}
        ctas={[
          { label: copy.hero.primaryCta.label, href: copy.hero.primaryCta.href },
          { label: copy.hero.secondaryCta.label, href: copy.hero.secondaryCta.href, variant: "secondary" },
        ]}
        priority
      />

      {/* ── Block 2: the need ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={copy.need.eyebrow} title={copy.need.title} />
        <p className="mt-6 text-lg leading-9 text-brand-ink">
          <TokenText>{copy.need.body}</TokenText>
        </p>
      </section>

      {/* ── Block 3: giving mechanic (C15) ─────────────────────────────── */}
      <section className="border-y border-brand-border bg-brand-mist/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <GivingMechanic
            id="give"
            heading={copy.giving.title}
            description="Every amount below covers a stage of the work. Choose one, or enter your own."
          />
        </div>
      </section>

      {/* ── Block 4: how it works (C7, 4 cards) ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={copy.howItWorks.eyebrow} title={copy.howItWorks.title} />
        <ProseMediaCardGrid
          className="mt-10"
          cards={copy.howItWorks.cards.map((card) => ({
            title: card.title,
            body: card.body,
            mediaKey: `how-it-works-${card.title}`,
          }))}
          theme="girls-in-tech"
          columns={2}
        />
      </section>

      {/* ── Block 5: loan-to-own ───────────────────────────────────────── */}
      <section className="border-y border-brand-border bg-brand-navy">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            {copy.loanToOwn.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            {copy.loanToOwn.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-white/85">
            <TokenText>{copy.loanToOwn.body}</TokenText>
          </p>
        </div>
      </section>

      {/* ── Block 6: one story (C10) — Phase 2, hidden until consented ─── */}
      {story ? (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={copy.story.eyebrow} title={copy.story.title} />
          <StoryCard className="mt-10" story={story} />
        </section>
      ) : null}

      {/* ── Block 7: where the machines come from ──────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={copy.whereFrom.eyebrow} title={copy.whereFrom.title} />
        <p className="mt-6 text-base leading-8 text-slate-600">{copy.whereFrom.body}</p>
        <Link
          href={copy.whereFrom.link.href}
          className="mt-5 inline-flex text-sm font-bold text-brand-primary transition hover:text-brand-ink"
        >
          {copy.whereFrom.link.label}
        </Link>
      </section>

      {/* ── Block 8: closing giving mechanic (C15, repeat of block 3) ──── */}
      <section className="border-t border-brand-border bg-brand-mist/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <GivingMechanic id="give-closing" heading="Give a laptop" />
        </div>
      </section>

      {/* ── Block 9: sticky mobile CTA (C14) ──────────────────────────── */}
      <StickyMobileCta label={copy.stickyCta.label} href={copy.stickyCta.href} />
    </div>
  );
}
