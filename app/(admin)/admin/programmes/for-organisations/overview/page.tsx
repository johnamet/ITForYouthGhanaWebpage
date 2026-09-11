import { redirect } from "next/navigation";

/**
 * The For Organisations overview is a descriptor now.
 *
 * Kept as a redirect rather than deleted because this path was the editor's
 * bookmark for the raw-JSON form it replaces, and because
 * lib/cms/admin-config.ts and the admin registry both pointed here until the
 * migration. The descriptor route sends a singleton on to its one document.
 */
export default function AdminOrganisationOverviewRedirect() {
  redirect("/admin/cms/page-for-organisations");
}
