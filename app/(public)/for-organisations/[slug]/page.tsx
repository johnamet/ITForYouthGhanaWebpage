import { notFound } from "next/navigation";

import { ContentPage } from "@/components/shared/content-page";
import { organisationPages } from "@/lib/content/site-config";

type OrganisationServicePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return organisationPages.map((service) => ({ slug: service.slug }));
}

export default function OrganisationServicePage({ params }: OrganisationServicePageProps) {
  const page = organisationPages.find((service) => service.slug === params.slug);
  if (!page) {
    notFound();
  }
  return <ContentPage page={page} />;
}
