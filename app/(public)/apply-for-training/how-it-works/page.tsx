import type { Metadata } from "next";

import { TrainingHowItWorksPage } from "@/components/training/training-how-it-works-page";
import { trainingHowItWorksContent } from "@/lib/content/training-config";

export const metadata: Metadata = {
  title: trainingHowItWorksContent.eyebrow,
  description: trainingHowItWorksContent.description,
};

export default function HowItWorksPage() {
  return <TrainingHowItWorksPage />;
}
