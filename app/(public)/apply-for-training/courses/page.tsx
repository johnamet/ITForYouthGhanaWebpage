export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { TrainingCourseListingPage } from "@/components/training/training-course-listing-page";
import { getTrainingCatalog } from "@/lib/api/training";

export const metadata: Metadata = {
  title: "Browse Courses | IT For Youth Ghana",
  description:
    "Find your path in tech with filterable IT For Youth Ghana training courses, upcoming cohorts, and a clear application process.",
};

export default async function TrainingCoursesPage() {
  const courses = await getTrainingCatalog();
  return <TrainingCourseListingPage courses={courses} />;
}
