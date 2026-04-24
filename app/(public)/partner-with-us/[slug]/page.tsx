import { notFound } from "next/navigation";

import { ContentPage } from "@/components/shared/content-page";
import { partnershipPages } from "@/lib/content/site-config";

type PartnershipDetailPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return partnershipPages.map((page) => ({ slug: page.slug }));
}

export default function PartnershipDetailPage({ params }: PartnershipDetailPageProps) {
  const page = partnershipPages.find((entry) => entry.slug === params.slug);
  if (!page) {
    notFound();
  }
  return <ContentPage page={page} />;
}
