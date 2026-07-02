import type { Metadata } from "next";

import { TrainingHowItWorksPage } from "@/components/training/training-how-it-works-page";
import { getCmsTrainingHowItWorksPage } from "@/lib/cms/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsTrainingHowItWorksPage();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function HowItWorksPage() {
  const page = await getCmsTrainingHowItWorksPage();

  return <TrainingHowItWorksPage page={page} />;
}
