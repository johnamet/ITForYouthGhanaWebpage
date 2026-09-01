import type { Metadata } from "next";

import { CalloutBox } from "@/components/laptop-bank/callout-box";
import { SpecTable } from "@/components/laptop-bank/spec-table";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { getIntakeItems } from "@/lib/cms/laptop-bank";
import { laptopBankWhatWeAcceptContent } from "@/lib/content/laptop-bank-config";

export const metadata: Metadata = {
  title: laptopBankWhatWeAcceptContent.meta.title,
  description: laptopBankWhatWeAcceptContent.meta.description,
};

/**
 * Page 5.3 — /laptop-bank/what-we-accept.
 *
 * Four blocks. Block 2, the firmware warning, MUST sit above block 3 — spec
 * 5.3 states that explicitly, and the reason is practical: firmware and device
 * management state is, per the intake records themselves, "the most common
 * reason a donation fails", so a reader must meet it before they start
 * measuring their fleet against the table.
 *
 * Draft 1 §4 §4 adds that this section "must not be softened".
 */
export default async function LaptopBankWhatWeAcceptRoute() {
  const intakeItems = await getIntakeItems();
  const copy = laptopBankWhatWeAcceptContent;

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt={copy.hero.title}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.introHeading}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laptop Bank", href: "/laptop-bank" },
          { label: "What we accept" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ── Block 1: intro ──────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
            {copy.introHeading}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">{copy.introBody}</p>
        </div>

        {/* ── Block 2: firmware warning — above block 3, per spec 5.3 ─── */}
        <CalloutBox
          className="mt-10 max-w-3xl"
          variant="warning"
          heading={copy.warningHeading}
          body={copy.warningBody}
        />
      </section>

      {/* ── Block 3: the full specification, split ─────────────────────── */}
      <section className="border-y border-brand-border bg-brand-mist/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The specification"
            title="Every unit is tested against these minimums"
          />
          <SpecTable className="mt-10" items={intakeItems} split />
        </div>
      </section>

      {/* ── Block 4: closing ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-base leading-8 text-brand-ink">{copy.closing}</p>
        <div className="mt-8">
          <Button href="/laptop-bank/donate-equipment" variant="solid-pink" size="lg">
            Offer your equipment
          </Button>
        </div>
      </section>
    </div>
  );
}
