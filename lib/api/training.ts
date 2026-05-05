import { getCourseCatalog } from "@/lib/api/courses";
import { seedTrainingCourses } from "@/lib/content/training-config";
import type { Course } from "@/types/course";

function sortCourses(courses: Course[]) {
  return [...courses].sort((left, right) => {
    if (!left.startDate && !right.startDate) {
      return left.title.localeCompare(right.title);
    }
    if (!left.startDate) {
      return 1;
    }
    if (!right.startDate) {
      return -1;
    }

    return new Date(left.startDate).getTime() - new Date(right.startDate).getTime();
  });
}

export async function getTrainingCatalog(): Promise<Course[]> {
  const liveCourses = await getCourseCatalog();
  if (liveCourses.length) {
    return sortCourses(liveCourses);
  }

  return sortCourses(seedTrainingCourses);
}
