export const dynamic = "force-dynamic";

import { CourseDetailCard } from "@/components/programs/course-detail-card";
import { getCourseBySlug } from "@/lib/api/courses";

type ProgramCourseDetailPageProps = {
  params: { courseSlug: string };
};

export default async function ProgramCourseDetailPage({ params }: ProgramCourseDetailPageProps) {
  const course = await getCourseBySlug(params.courseSlug);
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <CourseDetailCard course={course} fallbackTitle={params.courseSlug.replace(/-/g, " ")} />
    </div>
  );
}
