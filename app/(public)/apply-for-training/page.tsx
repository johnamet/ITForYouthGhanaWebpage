import type { Metadata } from "next";

import { ApplyForTrainingOverviewPage } from "@/components/training/apply-for-training-overview-page";
import { trainingLandingContent } from "@/lib/content/training-config";

export const metadata: Metadata = {
  title: "Apply for Training | IT For Youth Ghana",
  description:
    "Explore eligibility, course pathways, cohort timing, and the learner journey for IT For Youth Ghana training programmes.",
};

export default function ApplyForTrainingPage() {
  return <ApplyForTrainingOverviewPage content={trainingLandingContent} />;
}
