import { getLaptopBankPageContent } from "@/lib/cms/laptop-bank-pages";
import { getEligibilityFaqs } from "@/lib/cms/laptop-bank-faqs";
import type { Metadata } from "next";

import { CalloutBox } from "@/components/laptop-bank/callout-box";
import { ExpandableSection } from "@/components/laptop-bank/expandable-section";
import { TokenText } from "@/components/laptop-bank/token";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { herFirstLaptopEligibilityContent } from "@/lib/content/her-first-laptop-config";
import { pointsToParagraph } from "@/lib/utils/prose";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getLaptopBankPageContent<typeof herFirstLaptopEligibilityContent>("eligibility");
  return { title: copy.meta.title, description: copy.meta.description };
}

/**
 * Page 5.7 — /her-first-laptop/eligibility.
 *
 * Eight blocks in the spec's order.
 *
 * ON THE LISTS. Spec 5.7 calls blocks 1 and 3 bullet lists. This site's public
 * pages carry no bullet lists, and lib/utils/prose.ts is the established
 * mechanism for publishing list-shaped content as prose — the same treatment
 * every other content family here already goes through. Every COPY word
 * survives; only the glyphs go.
 *
 * Block 2 is different and stays a numbered list. Its ordering is semantic —
 * the spec presents the four selection criteria as a ranked list, and
 * flattening them into a sentence would lose the ranking, which is the one
 * thing an applicant most wants to know. It uses the numbered treatment
 * already established in components/organisations/organisation-enquiry-form.tsx:
 * numbered circles, no bullet glyph, no icon.
 */
export default async function HerFirstLaptopEligibilityRoute() {
  const [copy, faqs] = await Promise.all([
    getLaptopBankPageContent<typeof herFirstLaptopEligibilityContent>("eligibility"),
    getEligibilityFaqs(),
  ]);

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt={copy.hero.title}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Her First Laptop", href: "/her-first-laptop" },
          { label: "Eligibility" },
        ]}
      />

      <section className="mx-auto max-w-3xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {/* ── Block 1: who can apply ───────────────────────────────────── */}
        <div>
          <SectionHeading eyebrow={copy.whoCanApply.eyebrow} title={copy.whoCanApply.title} />
          <p className="mt-6 text-base leading-8 text-slate-600">
            <TokenText>{pointsToParagraph([...copy.whoCanApply.points])}</TokenText>
          </p>
        </div>

        {/* ── Block 2: how we choose — ordering is semantic ─────────────── */}
        <div>
          <SectionHeading eyebrow={copy.howWeChoose.eyebrow} title={copy.howWeChoose.title} />
          <ol className="mt-6 space-y-4">
            {copy.howWeChoose.criteria.map((criterion, index) => (
              <li key={criterion} className="flex gap-4 text-base leading-8 text-slate-600">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>
                  <TokenText>{criterion}</TokenText>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Block 3: what you commit to ──────────────────────────────── */}
        <div>
          <SectionHeading eyebrow={copy.commitments.eyebrow} title={copy.commitments.title} />
          <p className="mt-6 text-base leading-8 text-slate-600">
            <TokenText>{pointsToParagraph([...copy.commitments.points])}</TokenText>
          </p>
        </div>

        {/* ── Block 4: the cycle ───────────────────────────────────────── */}
        <div>
          <SectionHeading eyebrow={copy.cycle.eyebrow} title={copy.cycle.title} />
          <p className="mt-6 text-base leading-8 text-slate-600">
            <TokenText>{copy.cycle.body}</TokenText>
          </p>
        </div>

        {/* ── Block 5: if you are not selected ─────────────────────────── */}
        <div>
          <SectionHeading eyebrow={copy.ifNotSelected.eyebrow} title={copy.ifNotSelected.title} />
          <p className="mt-6 text-base leading-8 text-slate-600">{copy.ifNotSelected.body}</p>
        </div>

        {/* ── Block 6: no payment notice (C6 warning) ──────────────────── */}
        <CalloutBox
          variant="warning"
          heading={copy.noPaymentWarning.heading}
          body={copy.noPaymentWarning.body}
        />

        {/* ── Block 7: FAQ (C4 × 6) ────────────────────────────────────── */}
        <div>
          <SectionHeading eyebrow={copy.faqs.eyebrow} title={copy.faqs.title} />
          <div className="mt-8 space-y-4">
            {faqs.map((faq, index) => (
              <ExpandableSection
                key={faq.id}
                id={`faq-${index + 1}`}
                title={faq.question}
              >
                <TokenText>{faq.answer}</TokenText>
              </ExpandableSection>
            ))}
          </div>
        </div>

        {/* ── Block 8: CTA ─────────────────────────────────────────────── */}
        <div>
          <Button href={copy.cta.href} variant="solid-pink" size="lg">
            {copy.cta.label}
          </Button>
        </div>
      </section>
    </div>
  );
}
