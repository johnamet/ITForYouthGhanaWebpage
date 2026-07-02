import type { Metadata } from "next";

import { WhoWeArePage as WhoWeAreLandingPage } from "@/components/who-we-are/who-we-are-page";
import { getCmsWhoWeArePage } from "@/lib/cms/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsWhoWeArePage();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function WhoWeArePage() {
  const page = await getCmsWhoWeArePage();
  return <WhoWeAreLandingPage page={page} />;
}
