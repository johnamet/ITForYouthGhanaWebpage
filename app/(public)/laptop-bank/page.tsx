import type { Metadata } from "next";

import { LaptopBankLandingPage } from "@/components/laptop-bank/laptop-bank-landing-page";
import {
  getDashboardMetrics,
  getIntakeItems,
  getLogoConsentingDonors,
  getProcessStages,
} from "@/lib/cms/laptop-bank";
import { laptopBankLandingContent } from "@/lib/content/laptop-bank-config";
import { getLaptopBankPageContent } from "@/lib/cms/laptop-bank-pages";

/** Title and meta description exactly as spec 5.1 BUILD specifies them. */
export async function generateMetadata(): Promise<Metadata> {
  const copy = await getLaptopBankPageContent<typeof laptopBankLandingContent>("laptop-bank");
  return { title: copy.meta.title, description: copy.meta.description };
}

export default async function LaptopBankRoute() {
  const [copy, stages, intakeItems, metrics, logoDonors] = await Promise.all([
    getLaptopBankPageContent<typeof laptopBankLandingContent>("laptop-bank"),
    getProcessStages(),
    getIntakeItems(),
    getDashboardMetrics(),
    getLogoConsentingDonors(),
  ]);

  return (
    <LaptopBankLandingPage
      copy={copy}
      stages={stages}
      intakeItems={intakeItems}
      metrics={metrics}
      logoDonors={logoDonors}
    />
  );
}
