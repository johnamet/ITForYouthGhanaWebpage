export const dynamic = "force-dynamic";

import { ProgramsOverview } from "@/components/programs/programs-overview";
import { getCourseCatalog } from "@/lib/api/courses";

export default async function TrainingCoursesPage() {
  const courses = await getCourseCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ProgramsOverview courses={courses} />
    </div>
  );
}
