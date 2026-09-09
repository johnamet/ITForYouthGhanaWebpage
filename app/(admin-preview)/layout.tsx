import { redirect } from "next/navigation";

import { getCurrentAdminUser } from "@/lib/cms/admin-auth";

/**
 * Bare admin layout. Renders no shell chrome, because its only route is the
 * homepage preview document that the CMS workspace loads in an iframe. It
 * repeats the auth redirect from app/(admin)/layout.tsx rather than reusing
 * it, since that layout's whole purpose is to wrap children in AdminShell.
 */
export default async function AdminPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin-login");
  }

  return <>{children}</>;
}
