import type { Metadata } from "next";

import { ApplyForTrainingOverviewPage } from "@/components/training/apply-for-training-overview-page";
import { trainingLandingContent } from "@/lib/content/training-config";

export const metadata: Metadata = {
  title: trainingLandingContent.eyebrow,
  description: trainingLandingContent.description,
};

export default function ApplyForTrainingPage() {
  return <ApplyForTrainingOverviewPage content={trainingLandingContent} />;
}
