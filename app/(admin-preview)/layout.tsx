import { requireAdminPage } from "@/lib/cms/admin-auth";

/**
 * Bare admin layout. Renders no shell chrome, because every route in this
 * group is a preview document that a CMS workspace loads in an iframe: the
 * homepage preview, the site-page preview, and the descriptor page preview
 * that serves all sixteen routed singletons. It exists separately from
 * app/(admin)/layout.tsx because that layout's whole purpose is to wrap
 * children in AdminShell, which must not appear inside the iframe — but it
 * shares the same auth guard.
 */
export default async function AdminPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return <>{children}</>;
}
