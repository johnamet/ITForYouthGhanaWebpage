import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DepartmentDetailPage } from "@/components/departments/department-detail-page";
import {
  getCmsDepartmentBySlug,
  getCmsDepartments,
} from "@/lib/cms/departments";
import { getCmsTeamMembers } from "@/lib/cms/team";

type DepartmentPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const departments = await getCmsDepartments();
  return departments.map((department) => ({ slug: department.slug }));
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const department = await getCmsDepartmentBySlug(params.slug);

  if (!department) {
    return {
      title: "Department not found",
    };
  }

  return {
    title: department.title,
    description: department.summary || department.description,
    openGraph: {
      title: department.title,
      description: department.summary || department.description,
      images: department.heroImage ? [department.heroImage] : undefined,
    },
  };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const [department, teamMembers] = await Promise.all([
    getCmsDepartmentBySlug(params.slug),
    getCmsTeamMembers(),
  ]);

  if (!department) {
    notFound();
  }

  return <DepartmentDetailPage department={department} teamMembers={teamMembers} />;
}
