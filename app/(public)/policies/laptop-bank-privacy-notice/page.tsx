import type { Metadata } from "next";

import { CalloutBox } from "@/components/laptop-bank/callout-box";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { laptopBankPrivacyNoticeContent } from "@/lib/content/laptop-bank-config";

export const metadata: Metadata = {
  title: laptopBankPrivacyNoticeContent.meta.title,
  description: laptopBankPrivacyNoticeContent.meta.description,
};

/**
 * Page 5.9 — /policies/laptop-bank-privacy-notice.
 *
 * Spec 5.9: "Content supplied by IT for Youth; build the page structure now."
 * So the eight sections and their order are final and built; the body of each
 * is not drafted here.
 *
 * WHY NO DRAFT TEXT. A privacy notice is a legal document the organisation
 * publishes in its own name, and Draft 1 §6.2 flags the organisation's
 * registration position under Ghana's Data Protection Act, 2012 (Act 843) as
 * something to confirm with the Data Protection Commission or a Ghanaian
 * lawyer before the application form goes live. Writing plausible-sounding
 * text here would produce a document nobody at IT for Youth wrote, stating
 * retention periods and lawful bases nobody agreed — and readers would
 * reasonably rely on it. Spec §11 lists the privacy notice body as awaited
 * content, and §11's standing instruction is "do not invent values". Each
 * section therefore publishes the spec's own "must state" line as visible
 * editorial guidance, clearly marked as not yet the notice.
 *
 * Every form and every footer already links here (spec 5.9 BUILD), so this
 * page must be honest about its own state rather than silent.
 */
export default function LaptopBankPrivacyNoticeRoute() {
  const copy = laptopBankPrivacyNoticeContent;

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt={copy.hero.title}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Policies" },
          { label: "Laptop Bank privacy notice" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <CalloutBox variant="warning" heading="This notice is not yet published" body={copy.awaitedNotice} />

        <div className="mt-14 space-y-12">
          {copy.sections.map((section, index) => (
            <section key={section.anchor} id={section.anchor} className="scroll-mt-36">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                Section {index + 1}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
                {section.heading}
              </h2>
              <p className="mt-3 border-l-2 border-brand-border pl-5 text-base leading-8 text-slate-500">
                {section.mustState}
              </p>
              <p className="mt-3 pl-5 text-sm font-bold text-red-600">
                Awaiting the published text for this section.
              </p>
            </section>
          ))}
        </div>

        <p className="mt-14 text-sm leading-7 text-slate-500">
          Until this notice is published, any question about how IT for Youth Ghana handles your
          data can go to{" "}
          <a
            className="font-semibold text-brand-primary hover:text-brand-ink"
            href="mailto:info@itforyouthghana.org"
          >
            info@itforyouthghana.org
          </a>
          .
        </p>
      </section>
    </div>
  );
}
