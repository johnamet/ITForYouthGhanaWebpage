import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/cms/admin-auth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const adminUser = await requireAdminPage();

  return <AdminShell adminUser={adminUser}>{children}</AdminShell>;
}
