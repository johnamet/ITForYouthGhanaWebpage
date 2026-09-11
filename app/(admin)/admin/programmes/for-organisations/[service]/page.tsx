import { notFound, redirect } from "next/navigation";

import { organisationServices } from "@/lib/content/organisation-config";

/**
 * Each service page is a descriptor now, keyed `page-<slug>`.
 *
 * The slug is checked against the shipped services before redirecting so an
 * unknown one still 404s here, rather than bouncing an editor to a CMS route
 * that will 404 a step later for a reason that looks unrelated.
 */
export default function AdminOrganisationServiceRedirect({
  params,
}: {
  params: { service: string };
}) {
  const service = organisationServices.find((entry) => entry.slug === params.service);
  if (!service) notFound();

  redirect(`/admin/cms/page-${service.slug}`);
}
