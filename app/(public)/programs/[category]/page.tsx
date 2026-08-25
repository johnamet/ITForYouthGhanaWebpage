export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { ProgramsOverview } from "@/components/programs/programs-overview";
import { getCourseCatalog } from "@/lib/api/courses";

type ProgramCategoryPageProps = {
  params: { category: string };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default async function ProgramCategoryPage({ params }: ProgramCategoryPageProps) {
  const courses = await getCourseCatalog();
  const filtered = courses.filter((course) => slugify(course.category) === params.category);

  /**
   * An unknown category is a 404, not the whole catalogue.
   *
   * Falling back to every course meant /programs/anything answered 200 with the
   * same page as /programs, so the catalogue was indexable at as many URLs as
   * anyone cared to invent.
   */
  if (filtered.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ProgramsOverview courses={filtered} />
    </div>
  );
}
