export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { CourseDetailCard } from "@/components/programs/course-detail-card";
import { getCmsTrainingCoursesPage } from "@/lib/cms/site-pages";
import { getCourseBySlugMixed } from "@/lib/api/training";

type TrainingCourseDetailPageProps = {
  params: { slug: string };
};

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export async function generateMetadata({
  params,
}: TrainingCourseDetailPageProps): Promise<Metadata> {
  const course = await getCourseBySlugMixed(params.slug);
  const title = course?.title ?? titleFromSlug(params.slug);
  const description = course?.shortDescription ?? "Course details from IT For Youth Ghana.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: course?.image ? [{ url: course.image, alt: title }] : undefined,
    },
  };
}

export default async function TrainingCourseDetailPage({ params }: TrainingCourseDetailPageProps) {
  const course = await getCourseBySlugMixed(params.slug);
  const page = await getCmsTrainingCoursesPage();
  const mixedCourse = (await getCourseBySlugMixed(params.slug, (page as any).courses)) ?? course;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <CourseDetailCard course={mixedCourse} fallbackTitle={titleFromSlug(params.slug)} />
    </div>
  );
}
