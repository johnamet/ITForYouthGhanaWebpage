import type { Metadata } from "next";

import { WhatWeDoOverviewPage } from "@/components/what-we-do/what-we-do-overview-page";
import { initiatives, whatWeDoOverviewContent } from "@/lib/content/site-config";

export const metadata: Metadata = {
  title: whatWeDoOverviewContent.eyebrow,
  description: whatWeDoOverviewContent.description,
};

export default function WhatWeDoPage() {
  return <WhatWeDoOverviewPage content={whatWeDoOverviewContent} initiatives={initiatives} />;
}
