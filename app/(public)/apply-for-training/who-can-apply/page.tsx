import type { Metadata } from "next";

import { TrainingWhoCanApplyPage } from "@/components/training/training-who-can-apply-page";
import { trainingEligibilityContent } from "@/lib/content/training-config";

export const metadata: Metadata = {
  title: trainingEligibilityContent.eyebrow,
  description: trainingEligibilityContent.description,
};

export default function WhoCanApplyPage() {
  return <TrainingWhoCanApplyPage />;
}
