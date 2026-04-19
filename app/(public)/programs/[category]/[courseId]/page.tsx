export const dynamic = "force-dynamic";

import { CourseDetailCard } from "@/components/programs/course-detail-card";
import { getCourseBySlug } from "@/lib/api/courses";

type NestedCoursePageProps = {
  params: { courseId: string };
};

export default async function NestedCoursePage({ params }: NestedCoursePageProps) {
  const course = await getCourseBySlug(params.courseId);
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <CourseDetailCard course={course} fallbackTitle={params.courseId.replace(/-/g, " ")} />
    </div>
  );
}
