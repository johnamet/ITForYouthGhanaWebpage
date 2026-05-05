import type { Metadata } from "next";

import { TrainingHowItWorksPage } from "@/components/training/training-how-it-works-page";

export const metadata: Metadata = {
  title: "How It Works | IT For Youth Ghana",
  description:
    "Understand the IT For Youth Ghana learner journey from application to onboarding and cohort start.",
};

export default function HowItWorksPage() {
  return <TrainingHowItWorksPage />;
}
