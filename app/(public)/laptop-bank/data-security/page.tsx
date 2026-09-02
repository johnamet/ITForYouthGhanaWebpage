import { getLaptopBankPageContent } from "@/lib/cms/laptop-bank-pages";
import type { Metadata } from "next";

import { DocumentDownloadBlock } from "@/components/laptop-bank/document-download-block";
import { TokenText } from "@/components/laptop-bank/token";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { getLaptopBankDocuments } from "@/lib/cms/laptop-bank";
import {
  DATA_HANDLING_STATEMENT_ID,
  laptopBankDataSecurityContent,
} from "@/lib/content/laptop-bank-config";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getLaptopBankPageContent<typeof laptopBankDataSecurityContent>("data-security");
  return { title: copy.meta.title, description: copy.meta.description };
}

/**
 * Page 5.4 — /laptop-bank/data-security.
 *
 * Nine sections in the spec's order, each with the anchor spec 5.4 BUILD
 * names: #commitment, #method, #verification, #certificates, #custody,
 * #facility, #parts-drives, #tags, #exclusions. Spec §10 checks all nine
 * resolve.
 *
 * Draft 1 §6 on why this page matters more than the rest: "An IT manager who
 * gives you 200 laptops is personally accountable if company data walks out of
 * the building." So every claim here corresponds to a record, and anything not
 * yet true is a token rather than a promise — Draft 1 §16 forbids publishing a
 * named erasure standard the organisation is not demonstrably following, which
 * is exactly why {{WIPE_STANDARD}} is still a token.
 */
export default async function LaptopBankDataSecurityRoute() {
  const documents = await getLaptopBankDocuments();
  const copy = await getLaptopBankPageContent<typeof laptopBankDataSecurityContent>("data-security");
  const dataHandlingStatement = documents.filter(
    (document) => document.id === DATA_HANDLING_STATEMENT_ID,
  );

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt={copy.hero.title}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laptop Bank", href: "/laptop-bank" },
          { label: "Data security" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:items-start">
          {/* On-page navigation, so the nine anchors are reachable without
              hunting. Draft 1 §5 asks for a sticky side navigation on the
              process page; the same treatment earns its place here, where a
              compliance reader is looking for one specific section. */}
          <nav aria-label="On this page" className="lg:sticky lg:top-36">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              On this page
            </p>
            <ol className="mt-4 space-y-2">
              {copy.sections.map((section, index) => (
                <li key={section.anchor}>
                  <a
                    href={`#${section.anchor}`}
                    className="flex gap-3 text-sm leading-6 text-slate-600 transition hover:text-brand-primary"
                  >
                    <span className="font-bold text-brand-navy">{index + 1}</span>
                    <span>{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {copy.sections.map((section, index) => (
              <section key={section.anchor} id={section.anchor} className="scroll-mt-36">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Section {index + 1}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink sm:text-3xl">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  <TokenText>{section.body}</TokenText>
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Spec 5.4 BUILD: "Page ends with a C12 block containing one file: the
          data handling statement PDF, versioned and dated." */}
      <section className="border-t border-brand-border bg-brand-mist/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Document"
            title="Our data handling statement"
            description="The full statement, versioned and dated, for your records."
          />
          <DocumentDownloadBlock className="mt-10 max-w-3xl" documents={dataHandlingStatement} />
        </div>
      </section>
    </div>
  );
}
