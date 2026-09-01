import type { Metadata } from "next";

import { EquipmentOfferForm } from "@/components/laptop-bank/equipment-offer-form";
import { TokenText } from "@/components/laptop-bank/token";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { laptopBankDonateEquipmentContent } from "@/lib/content/laptop-bank-config";

export const metadata: Metadata = {
  title: laptopBankDonateEquipmentContent.meta.title,
  description: laptopBankDonateEquipmentContent.meta.description,
};

/**
 * Page 5.5 — /laptop-bank/donate-equipment.
 *
 * Three blocks: heading and intro, the three-step form, and the confirmation
 * state. The confirmation is not a block this page renders — MultiStepForm
 * swaps it in place of the form on the same URL, because spec 5.5 BEHAVIOUR is
 * explicit: "Do not redirect to a generic thank-you page."
 */
export default function LaptopBankDonateEquipmentRoute() {
  const copy = laptopBankDonateEquipmentContent;

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt={copy.heading}
        eyebrow="IT for Youth Laptop Bank"
        title={copy.heading}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laptop Bank", href: "/laptop-bank" },
          { label: "Offer your equipment" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:items-start">
          <aside className="lg:sticky lg:top-36">
            <p className="text-base leading-8 text-brand-ink">
              <TokenText>{copy.intro}</TokenText>
            </p>

            <div className="mt-8 rounded-[24px] border border-brand-border bg-brand-mist/40 p-5 text-sm leading-7 text-slate-600">
              <p className="font-bold text-brand-ink">Would rather talk to someone?</p>
              <p className="mt-1">
                Email{" "}
                <a
                  className="font-semibold text-brand-primary hover:text-brand-ink"
                  href="mailto:info@itforyouthghana.org"
                >
                  info@itforyouthghana.org
                </a>{" "}
                with roughly what you have and when. Some organisations never use a web form, and
                that is fine.
              </p>
            </div>

            {/* Spec 5.9 BUILD: the privacy notice links from both forms. */}
            <p className="mt-6 text-sm leading-7 text-slate-500">
              Everything you send here is handled as described in our{" "}
              <a
                href="/policies/laptop-bank-privacy-notice"
                className="font-semibold text-brand-primary hover:text-brand-ink"
              >
                Laptop Bank privacy notice
              </a>
              .
            </p>
          </aside>

          <EquipmentOfferForm />
        </div>
      </section>
    </div>
  );
}
