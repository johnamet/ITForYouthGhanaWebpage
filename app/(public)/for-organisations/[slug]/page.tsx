import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrganisationServicePage as OrganisationServiceTemplate } from "@/components/organisations/organisation-service-page";
import { organisationServices } from "@/lib/content/organisation-config";
import { getCmsOrganisationService } from "@/lib/cms/organisations";

type OrganisationServicePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return organisationServices.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: OrganisationServicePageProps): Metadata {
  const page = organisationServices.find((service) => service.slug === params.slug);

  if (!page) {
    return {
      title: "For Organisations",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function OrganisationServiceRoute({ params }: OrganisationServicePageProps) {
  const page = await getCmsOrganisationService(params.slug);
  if (!page) {
    notFound();
  }
  return <OrganisationServiceTemplate page={page} />;
}
