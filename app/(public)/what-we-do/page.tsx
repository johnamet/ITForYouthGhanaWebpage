import type { Metadata } from "next";

import { WhatWeDoOverviewPage } from "@/components/what-we-do/what-we-do-overview-page";
import { initiatives } from "@/lib/content/site-config";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Explore the eight initiatives through which IT For Youth Ghana expands digital opportunity for young people, schools, communities, and partners.",
};

export default function WhatWeDoPage() {
  return <WhatWeDoOverviewPage initiatives={initiatives} />;
}
