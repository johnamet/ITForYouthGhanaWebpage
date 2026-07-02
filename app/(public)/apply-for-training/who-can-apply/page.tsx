import type { Metadata } from "next";

import { TrainingWhoCanApplyPage } from "@/components/training/training-who-can-apply-page";
import { getCmsTrainingWhoCanApplyPage } from "@/lib/cms/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsTrainingWhoCanApplyPage();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function WhoCanApplyPage() {
  const page = await getCmsTrainingWhoCanApplyPage();

  return <TrainingWhoCanApplyPage page={page} />;
}
