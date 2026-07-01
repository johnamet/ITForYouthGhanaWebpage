export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { TrainingCourseListingPage } from "@/components/training/training-course-listing-page";
import { getTrainingCatalog } from "@/lib/api/training";
import { trainingCatalogContent } from "@/lib/content/training-config";

export const metadata: Metadata = {
  title: trainingCatalogContent.eyebrow,
  description: trainingCatalogContent.description,
};

export default async function TrainingCoursesPage() {
  const courses = await getTrainingCatalog();
  return <TrainingCourseListingPage courses={courses} />;
}
