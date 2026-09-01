import type { Metadata } from "next";

import { LaptopBankLandingPage } from "@/components/laptop-bank/laptop-bank-landing-page";
import {
  getDashboardMetrics,
  getIntakeItems,
  getLogoConsentingDonors,
  getProcessStages,
} from "@/lib/cms/laptop-bank";
import { laptopBankLandingContent } from "@/lib/content/laptop-bank-config";

/** Title and meta description exactly as spec 5.1 BUILD specifies them. */
export const metadata: Metadata = {
  title: laptopBankLandingContent.meta.title,
  description: laptopBankLandingContent.meta.description,
};

export default async function LaptopBankRoute() {
  const [stages, intakeItems, metrics, logoDonors] = await Promise.all([
    getProcessStages(),
    getIntakeItems(),
    getDashboardMetrics(),
    getLogoConsentingDonors(),
  ]);

  return (
    <LaptopBankLandingPage
      stages={stages}
      intakeItems={intakeItems}
      metrics={metrics}
      logoDonors={logoDonors}
    />
  );
}
