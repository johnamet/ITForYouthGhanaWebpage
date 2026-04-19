import { Course, RawApiResponse, transformCourseData } from "@/types/course";

const COURSE_API_ENDPOINT =
  process.env.COURSE_API_ENDPOINT || "https://portal.itforyouthghana.org/api/courses";
const PUBLIC_API_BASE = COURSE_API_ENDPOINT.replace(/\/api\/courses\/?$/, "/api/public/courses");

const extractCourses = (payload: RawApiResponse) => {
  if (Array.isArray(payload.data?.data)) {
    return payload.data.data;
  }
  if (Array.isArray(payload.data?.courses)) {
    return payload.data.courses;
  }
  return [];
};

export async function getCourseCatalog(): Promise<Course[]> {
  try {
    const response = await fetch(COURSE_API_ENDPOINT, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as RawApiResponse;
    if (!payload.success) {
      return [];
    }

    return extractCourses(payload)
      .map((course) => {
        try {
          return transformCourseData(course);
        } catch {
          return null;
        }
      })
      .filter((course): course is Course => course !== null);
  } catch {
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const payload = (await response.json()) as { success?: boolean; data?: unknown };
      if (payload.success && payload.data) {
        return transformCourseData(payload.data);
      }
    }
  } catch {
    // Fall through to catalog lookup below.
  }

  const courses = await getCourseCatalog();
  return courses.find((course) => course.slug === slug || course.id === slug) ?? null;
}
