import type { Metadata } from "next";

import { AwaitingRecords } from "@/components/laptop-bank/awaiting-records";
import { DonorLogoGrid, DonorQuoteCards } from "@/components/laptop-bank/donor-logo-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { getLogoConsentingDonors, getQuotableDonors } from "@/lib/cms/laptop-bank";

const PHASE_2_NOINDEX = { index: false, follow: false } as const;

/** Spec 5.12 BEHAVIOUR: suppressed until at least 4 records consent to a logo. */
const MINIMUM_LOGOS = 4;

export async function generateMetadata(): Promise<Metadata> {
  const donors = await getLogoConsentingDonors();

  return {
    title: "Laptop Bank partner organisations | IT For Youth Ghana",
    description:
      "The organisations whose fleet refreshes equip the IT for Youth Laptop Bank.",
    robots: donors.length >= MINIMUM_LOGOS ? undefined : PHASE_2_NOINDEX,
  };
}

/**
 * Page 5.12 — /laptop-bank/partners (Phase 2).
 *
 * Both queries have already enforced consent (spec §4 DATA), so nothing on
 * this page filters. Recognition tier copy is awaited from IT for Youth (spec
 * §11), and is not drafted here.
 *
 * Draft 1 §4 §7 on why the empty state is worded the way it is: until there
 * are logos, "founding-partner framing is worth more than a thin logo wall".
 */
export default async function LaptopBankPartnersRoute() {
  const [logoDonors, quotableDonors] = await Promise.all([
    getLogoConsentingDonors(),
    getQuotableDonors(),
  ]);

  const populated = logoDonors.length >= MINIMUM_LOGOS;

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt="Laptop Bank partner organisations"
        eyebrow="IT for Youth Laptop Bank"
        title="Partner organisations"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laptop Bank", href: "/laptop-bank" },
          { label: "Partners" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {populated ? (
          <>
            <SectionHeading
              eyebrow="Partner organisations"
              title="The organisations equipping this programme"
            />
            <DonorLogoGrid className="mt-10" donors={logoDonors} />
          </>
        ) : (
          <AwaitingRecords
            title="We are recruiting our founding partner organisations"
            body="If you would like your organisation to be among the first, offer your equipment and tell us how you would like to be recognised. We publish a logo only where an organisation has told us in writing that we may."
          />
        )}
      </section>

      {quotableDonors.length ? (
        <section className="border-t border-brand-border bg-brand-mist/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="In their words" title="Why they gave" />
            <DonorQuoteCards className="mt-10" donors={quotableDonors} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
