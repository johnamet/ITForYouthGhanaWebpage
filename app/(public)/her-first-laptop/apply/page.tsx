import type { Metadata } from "next";

import { StudentApplicationForm } from "@/components/laptop-bank/student-application-form";
import { TokenText } from "@/components/laptop-bank/token";
import { herFirstLaptopApplyContent } from "@/lib/content/her-first-laptop-config";

export const metadata: Metadata = {
  title: herFirstLaptopApplyContent.meta.title,
  description: herFirstLaptopApplyContent.meta.description,
};

/**
 * Page 5.8 — /her-first-laptop/apply.
 *
 * Three blocks: the eligibility and commitments summary, the form, and the
 * confirmation state (rendered in place of the form by MultiStepForm, on the
 * same URL).
 *
 * TWO CONSTRAINTS SHAPE THIS PAGE, both from spec 5.8 BEHAVIOUR.
 *
 * First, "Mobile first. Target a full page weight under 500 KB. Most
 * applicants are on a phone on mobile data." That is why this page has no
 * EditorialImageHero and no photography at all: this is the one page in the
 * programme where a hero image would cost an applicant real money and real
 * abandonment, and Draft 1 §14.1 asks the same. This is a deliberate exception
 * to the site's pair-prose-with-media standard, not an oversight.
 *
 * Second, the eligibility summary "must appear before the first field", so it
 * is rendered here above the form rather than inside it. Draft 1 §9 §5 gives
 * the reason: an applicant who reaches field 14 and discovers they need a
 * document they do not have will abandon, and then message the team instead.
 */
export default function HerFirstLaptopApplyRoute() {
  const copy = herFirstLaptopApplyContent;

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
          Her First Laptop
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-brand-ink sm:text-5xl">
          {copy.heading}
        </h1>

        {/* ── Block 1: eligibility and commitments, before the first field ── */}
        <div className="mt-8 rounded-[28px] border-l-4 border-brand-gold bg-brand-mist/50 px-6 py-7 sm:px-8">
          <h2 className="font-heading text-xl font-bold text-brand-ink sm:text-2xl">
            {copy.summaryHeading}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">{copy.eligibilitySummary}</p>
          <p className="mt-4 text-base leading-8 text-slate-700">
            <TokenText>{copy.commitmentsSummary}</TokenText>
          </p>
          <p className="mt-4 text-base leading-8 text-slate-700">{copy.needBeforeYouStart}</p>
          <a
            href="/her-first-laptop/eligibility"
            className="mt-5 inline-flex text-sm font-bold text-brand-primary transition hover:text-brand-ink"
          >
            Read the full eligibility and selection criteria
          </a>
        </div>

        {/* ── Block 2: the form ─────────────────────────────────────────── */}
        <div className="mt-10">
          <StudentApplicationForm />
        </div>

        {/* Spec 5.9 BUILD: the privacy notice links from both forms. */}
        <p className="mt-8 text-sm leading-7 text-slate-500">
          Everything you send here is handled as described in our{" "}
          <a
            href="/policies/laptop-bank-privacy-notice"
            className="font-semibold text-brand-primary hover:text-brand-ink"
          >
            Laptop Bank privacy notice
          </a>
          .
        </p>
      </section>
    </div>
  );
}
