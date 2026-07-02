import type { Metadata } from "next";

import { ApplyForTrainingOverviewPage } from "@/components/training/apply-for-training-overview-page";
import { getCmsApplyForTrainingPage } from "@/lib/cms/site-pages";
import { trainingLandingContent } from "@/lib/content/training-config";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsApplyForTrainingPage();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function ApplyForTrainingPage() {
  const page = await getCmsApplyForTrainingPage();

  return (
    <ApplyForTrainingOverviewPage
      page={page}
      cohorts={trainingLandingContent.cohorts}
      process={trainingLandingContent.process}
    />
  );
}
