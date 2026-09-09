import { requireAdminPage } from "@/lib/cms/admin-auth";

/**
 * Bare admin layout. Renders no shell chrome, because its only route is the
 * homepage preview document that the CMS workspace loads in an iframe. It
 * exists separately from app/(admin)/layout.tsx because that layout's whole
 * purpose is to wrap children in AdminShell, which must not appear inside the
 * iframe — but it shares the same auth guard.
 */
export default async function AdminPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return <>{children}</>;
}
