import type { Metadata } from "next";

import { CalloutBox } from "@/components/laptop-bank/callout-box";
import { TokenText } from "@/components/laptop-bank/token";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { isTokenResolved, token } from "@/lib/content/laptop-bank-tokens";

const PHASE_2_NOINDEX = { index: false, follow: false } as const;

/**
 * Page 5.13 — /laptop-bank/recycling (Phase 2).
 *
 * noindex until {{RECYCLER}} is supplied. Draft 1 §16 is blunt about why:
 * never publish "any statement that equipment is 'recycled responsibly'
 * without a named partner behind it", and Draft 1 §5 stage 8 adds that "Ghana
 * carries a heavy reputational load on electronic waste and a vague answer
 * here will be read as evasion by any informed donor or funder". So this page
 * indexes only once there is a named licensed handler behind its claims.
 *
 * This is also the ONE page in the programme where waste language is correct.
 * Draft 1 §2 restricts "e-waste" and "scrap" to exactly this section; anywhere
 * else in this codebase, incoming donations are retired assets, never waste.
 */
export function generateMetadata(): Metadata {
  return {
    title: "Recycling and electronic waste | IT for Youth Laptop Bank",
    description:
      "What happens to units the IT for Youth Laptop Bank cannot renew, the licensed handler behind that, and why we are not an import route for foreign electronic waste.",
    robots: isTokenResolved("RECYCLER") ? undefined : PHASE_2_NOINDEX,
  };
}

export default function LaptopBankRecyclingRoute() {
  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt="Recycling and electronic waste"
        eyebrow="IT for Youth Laptop Bank"
        title="Recycling and e-waste"
        description="What happens to the units we cannot renew, and the evidence behind it."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laptop Bank", href: "/laptop-bank" },
          { label: "Recycling" },
        ]}
      />

      <section className="mx-auto max-w-3xl space-y-14 px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <SectionHeading eyebrow="Our handler" title="Who handles what we cannot renew" />
          <p className="mt-6 text-base leading-8 text-slate-600">
            Units leave our facility only through a licensed electronic waste handler, against a
            weight receipt and a certificate of destruction. Our handler and its licence reference:{" "}
            <TokenText>{token("RECYCLER")}</TokenText>
          </p>
        </div>

        <div>
          <SectionHeading eyebrow="Evidence" title="Certificates of destruction" />
          <p className="mt-6 text-base leading-8 text-slate-600">
            Every disposal certificate is referenced against the asset tag of every unit it covers,
            so a donor organisation can trace any machine it gave us to its end of life. Donors
            receive the certificates covering their own rejected units.
          </p>
        </div>

        <div>
          <SectionHeading eyebrow="Volumes" title="Annual volumes by weight" />
          <p className="mt-6 text-base leading-8 text-slate-600">
            We publish volumes and certificates annually. The first annual figures will appear here
            once a full reporting year has completed — we do not publish a weight we cannot
            evidence from a receipt.
          </p>
        </div>

        {/*
          Spec 5.13: an "explicit statement that we are not an import route for
          foreign electronic waste". Given as a callout rather than a
          paragraph because it is the single claim an informed Ghanaian reader
          or regulator is scanning this page for.
        */}
        <CalloutBox
          variant="info"
          heading="We are not an import route for foreign electronic waste"
          body="Everything we accept is assessed against a published intake specification before collection, and we decline in writing what falls below it. We do not accept anonymous bulk drops, and we do not take equipment from outside Ghana that we could not deploy here. Nothing we receive is sold into the informal repair market, and nothing is left in general waste."
        />
      </section>
    </div>
  );
}
