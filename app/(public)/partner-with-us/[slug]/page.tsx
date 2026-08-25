import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PartnershipTrackPage as PartnershipTrackTemplate } from "@/components/partnerships/partnership-track-page";
import { partnershipTracks } from "@/lib/content/partnership-config";
import { getCmsPartnershipTrackBySlug } from "@/lib/cms/partnerships";

type PartnershipDetailPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return partnershipTracks.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: PartnershipDetailPageProps): Metadata {
  const page = partnershipTracks.find((entry) => entry.slug === params.slug);

  if (!page) {
    return {
      title: "Partner With Us",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function PartnershipDetailPage({ params }: PartnershipDetailPageProps) {
  const page = await getCmsPartnershipTrackBySlug(params.slug);
  if (!page) notFound();
  return <PartnershipTrackTemplate page={page} />;
}
