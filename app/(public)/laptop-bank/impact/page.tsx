import type { Metadata } from "next";

import { AwaitingRecords } from "@/components/laptop-bank/awaiting-records";
import { DocumentDownloadBlock } from "@/components/laptop-bank/document-download-block";
import { MetricCardGrid } from "@/components/laptop-bank/metric-card-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { getDashboardMetrics, getLaptopBankDocuments } from "@/lib/cms/laptop-bank";

const PHASE_2_NOINDEX = { index: false, follow: false } as const;

/**
 * Page 5.11 — /laptop-bank/impact (Phase 2).
 *
 * noindex until the Dashboard Metrics record exists (spec §10). The gate is
 * the real data rather than a hardcoded flag, so this page starts indexing
 * itself the moment a record lands and nobody has to remember to flip a
 * switch.
 */
export async function generateMetadata(): Promise<Metadata> {
  const metrics = await getDashboardMetrics();

  return {
    title: "Laptop Bank impact and reporting | IT For Youth Ghana",
    description:
      "Units received, deployed and recycled, by programme and by region, from the IT for Youth Laptop Bank.",
    robots: metrics ? undefined : PHASE_2_NOINDEX,
  };
}

export default async function LaptopBankImpactRoute() {
  const [metrics, documents] = await Promise.all([
    getDashboardMetrics(),
    getLaptopBankDocuments(),
  ]);

  // Spec 5.11 BUILD: "Downloads block: annual Laptop Bank report, data
  // handling statement, intake specification, recycling summary." Only the two
  // that exist as records today are listed; the annual report and recycling
  // summary join the Document collection when they are written.
  const reportDocuments = documents.filter((document) =>
    ["data-handling-statement", "intake-specification"].includes(document.id),
  );

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt="Laptop Bank impact and reporting"
        eyebrow="IT for Youth Laptop Bank"
        title="Impact and reporting"
        description="Once you call something a bank, readers expect a register. These are the figures we publish, including the unflattering ones."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laptop Bank", href: "/laptop-bank" },
          { label: "Impact" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {metrics ? (
          <MetricCardGrid metrics={metrics} />
        ) : (
          <AwaitingRecords
            title="No figures published yet"
            body="The first consignment has not yet completed the process end to end, so there is nothing here we can evidence from a record. We would rather publish nothing than publish a number we cannot stand behind. This page fills in once the first consignment is deployed and counted."
          />
        )}
      </section>

      {reportDocuments.length ? (
        <section className="border-t border-brand-border bg-brand-mist/30">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Reports" title="Reports and downloads" />
            <DocumentDownloadBlock className="mt-10" documents={reportDocuments} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
