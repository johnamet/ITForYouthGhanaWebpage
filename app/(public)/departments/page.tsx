import type { Metadata } from "next";

import { DepartmentsIndexPage } from "@/components/departments/departments-index-page";
import { getCmsDepartments } from "@/lib/cms/departments";

export const metadata: Metadata = {
  title: "Departments",
  description:
    "Explore the departments behind IT For Youth Ghana's programmes, partnerships, outreach, operations, impact, communications, and people systems.",
};

export default async function DepartmentsPage() {
  const departments = await getCmsDepartments();

  return <DepartmentsIndexPage departments={departments} />;
}
