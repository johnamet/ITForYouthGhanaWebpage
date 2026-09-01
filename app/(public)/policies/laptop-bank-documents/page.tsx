import type { Metadata } from "next";

import { DocumentDownloadBlock } from "@/components/laptop-bank/document-download-block";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { getLaptopBankDocuments } from "@/lib/cms/laptop-bank";
import { laptopBankDocumentsContent } from "@/lib/content/laptop-bank-config";

export const metadata: Metadata = {
  title: laptopBankDocumentsContent.meta.title,
  description: laptopBankDocumentsContent.meta.description,
};

/**
 * Page 5.10 — /policies/laptop-bank-documents.
 *
 * One page of C12 blocks grouped by audience_tag. Every one of the six launch
 * files is awaited (spec §11), so at launch this page reads as a published
 * index of what is coming rather than a set of live downloads. That is the
 * honest state, and it is more useful than hiding the page: a procurement
 * reader can see that a Deed of Gift template exists and ask for it.
 *
 * Spec 5.10 DATA: "Every file displays version and date. Superseded versions
 * are removed, not stacked." Removal is a CMS action; nothing here stacks two
 * versions of the same document id.
 */
export default async function LaptopBankDocumentsRoute() {
  const documents = await getLaptopBankDocuments();
  const copy = laptopBankDocumentsContent;

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt={copy.hero.title}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Policies" },
          { label: "Laptop Bank documents" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <DocumentDownloadBlock
          documents={documents}
          groupByAudience
          headings={copy.audienceHeadings}
        />
      </section>
    </div>
  );
}
