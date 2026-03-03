// API data access layer for course-related operations
// Handles data transformation, caching, and error recovery
import { Course, CourseCategory, transformCourseData, RawApiResponse } from "../../types/course";

// Configuration
const COURSE_API_ENDPOINT =
  import.meta.env.VITE_COURSE_API_ENDPOINT || "https://portal.itforyouthghana.org/api/courses";

// Derive the public courses endpoint (supports /categories, /:id, /:id/apply-url)
const PUBLIC_API_BASE = COURSE_API_ENDPOINT.replace(/\/api\/courses\/?$/, "/api/public/courses");

const CACHE_KEY = "courses_cache_v3"; // v3 indicates stale-while-revalidate
const CATEGORIES_CACHE_KEY = "course_categories_cache_v1";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (fresh)
const STALE_DURATION = 30 * 60 * 1000; // 30 minutes (stale but usable)
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

interface CacheEntry<T = Course[]> {
  data: T;
  timestamp: number;
}

const extractCoursesFromResponse = (rawData: unknown): unknown[] | null => {
  if (typeof rawData !== "object" || rawData === null) return null;
  const response = rawData as Partial<RawApiResponse> & {
    data?: { data?: unknown[]; courses?: unknown[] };
  };

  if (Array.isArray(response.data?.data)) return response.data.data;
  if (Array.isArray(response.data?.courses)) return response.data.courses; // Legacy shape
  return null;
};

const extractCourseFromDetailResponse = (rawData: unknown): unknown | null => {
  if (typeof rawData !== "object" || rawData === null) return null;
  const response = rawData as {
    data?: unknown | { data?: unknown };
  };
  if (response.data && typeof response.data === "object" && response.data !== null && "data" in response.data) {
    return (response.data as { data?: unknown }).data ?? null;
  }
  return response.data ?? null;
};

const normalizeCategory = (raw: unknown): CourseCategory | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const category = raw as Record<string, unknown>;
  const id = typeof category.id === "string" ? category.id : null;
  const name = typeof category.name === "string" ? category.name : null;
  if (!id || !name) return null;

  const rawCount = category.course_count ?? category.courseCount ?? 0;
  const count =
    typeof rawCount === "number"
      ? rawCount
      : typeof rawCount === "string"
        ? parseInt(rawCount, 10) || 0
        : 0;

  return {
    id,
    name,
    description: typeof category.description === "string" ? category.description : null,
    course_count: count,
  };
};

// Check if cache is fresh (< 5 min)
const isCacheFresh = <T>(cache: CacheEntry<T> | null): boolean => {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
};

// Check if cache is stale but still usable (< 30 min)
const isCacheStale = <T>(cache: CacheEntry<T> | null): boolean => {
  if (!cache) return false;
  const age = Date.now() - cache.timestamp;
  return age >= CACHE_DURATION && age < STALE_DURATION;
};

// Get cached data from sessionStorage
function getCached<T>(key: string): CacheEntry<T> | null {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const entry: CacheEntry<T> = JSON.parse(cached);
    // Evict if older than stale duration
    if (Date.now() - entry.timestamp >= STALE_DURATION) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry;
  } catch (error) {
    console.error("[courseApi] Error reading cache:", error);
    return null;
  }
}

// Set cached data in sessionStorage
function setCached<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error("[courseApi] Error writing cache:", error);
  }
}

/**
 * Fetches courses from the API with stale-while-revalidate caching.
 * - Fresh cache (<5min): returns immediately
 * - Stale cache (5-30min): returns stale data, revalidates in background
 * - No cache: fetches with retry logic
 */
export const fetchCourses = async (
  useCache: boolean = true,
  retries: number = MAX_RETRIES,
): Promise<Course[]> => {
  // Fresh cache — return immediately
  if (useCache) {
    const cached = getCached<Course[]>(CACHE_KEY);
    if (cached && isCacheFresh(cached)) {
      console.log("[courseApi] Fresh cache hit, count:", cached.data.length);
      return cached.data;
    }

    // Stale cache — return stale data and revalidate in background
    if (cached && isCacheStale(cached)) {
      console.log("[courseApi] Stale cache — serving stale, revalidating in background");
      // Fire-and-forget background revalidation
      fetchCoursesFromApi(retries)
        .then((courses) => {
          setCached(CACHE_KEY, courses);
          console.log("[courseApi] Background revalidation complete, updated cache");
        })
        .catch((err) => {
          console.warn("[courseApi] Background revalidation failed:", err.message);
        });
      return cached.data;
    }
  }

  // No usable cache — fetch fresh
  const courses = await fetchCoursesFromApi(retries);
  setCached(CACHE_KEY, courses);
  return courses;
};

/**
 * Internal: fetch courses from the API with retry logic.
 */
async function fetchCoursesFromApi(retries: number): Promise<Course[]> {
  console.log("[courseApi] Fetching courses from API:", COURSE_API_ENDPOINT);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(COURSE_API_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();

      if (!rawData.success) {
        throw new Error(`API returned success: false - ${rawData.message}`);
      }

      const courseArray = extractCoursesFromResponse(rawData);
      if (!Array.isArray(courseArray)) {
        console.error("[courseApi] Unexpected data structure:", rawData);
        throw new Error("Invalid API response: expected course array in data.data");
      }

      console.log("[courseApi] Processing", courseArray.length, "courses from API");

      const courses = courseArray
        .map((rawCourse: unknown, index: number) => {
          try {
            return transformCourseData(rawCourse);
          } catch (error) {
            console.warn(`[courseApi] Failed to transform course at index ${index}:`, error);
            return null;
          }
        })
        .filter((course: Course | null): course is Course => course !== null);

      console.log(`[courseApi] Successfully transformed ${courses.length} courses`);
      return courses;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[courseApi] Fetch attempt ${attempt + 1}/${retries} failed:`,
        lastError.message,
      );

      if (attempt < retries - 1) {
        const delayMs = Math.pow(2, attempt) * 1000;
        console.log(`[courseApi] Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error("Failed to fetch courses after all retries");
}

/**
 * Fetches a single course by slug or ID using the public API detail endpoint.
 * Falls back to finding from the full list if direct fetch fails.
 */
export const fetchCourseBySlug = async (slugOrId: string): Promise<Course | null> => {
  try {
    console.log("[courseApi] Fetching course by slug:", slugOrId);

    const response = await fetch(`${PUBLIC_API_BASE}/${encodeURIComponent(slugOrId)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("[courseApi] Course not found:", slugOrId);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();
    if (!rawData.success || !rawData.data) {
      throw new Error("Invalid response from course detail endpoint");
    }

    return transformCourseData(extractCourseFromDetailResponse(rawData));
  } catch (error) {
    console.warn("[courseApi] Direct course fetch failed, falling back to list:", error);
    // Fallback: find from cached/full list
    try {
      const courses = await fetchCourses(true);
      return courses.find((c) => c.slug === slugOrId || c.id === slugOrId) || null;
    } catch {
      return null;
    }
  }
};

/**
 * Fetches a single course by ID (legacy — searches from full list)
 */
export const fetchCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    console.log("[courseApi] Fetching course by ID:", courseId);
    const courses = await fetchCourses(true);
    const course = courses.find((course) => course.id === courseId) || null;

    if (!course) {
      console.warn("[courseApi] Course not found:", courseId);
    }

    return course;
  } catch (error) {
    console.error("[courseApi] Error fetching course by ID:", error);
    return null;
  }
};

/**
 * Fetches course categories with counts from the public API.
 * Uses stale-while-revalidate caching.
 */
export const fetchCourseCategories = async (): Promise<CourseCategory[]> => {
  // Check cache
  const cached = getCached<CourseCategory[]>(CATEGORIES_CACHE_KEY);
  if (cached && isCacheFresh(cached)) {
    console.log("[courseApi] Fresh categories cache hit");
    return cached.data;
  }

  if (cached && isCacheStale(cached)) {
    console.log("[courseApi] Stale categories cache — serving stale, revalidating");
    fetchCategoriesFromApi()
      .then((cats) => {
        setCached(CATEGORIES_CACHE_KEY, cats);
      })
      .catch((err) => {
        console.warn("[courseApi] Categories revalidation failed:", err.message);
      });
    return cached.data;
  }

  const categories = await fetchCategoriesFromApi();
  setCached(CATEGORIES_CACHE_KEY, categories);
  return categories;
};

async function fetchCategoriesFromApi(): Promise<CourseCategory[]> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/categories`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();
    if (!rawData.success || !Array.isArray(rawData.data)) {
      throw new Error("Invalid categories response");
    }

    return rawData.data
      .map((item: unknown) => normalizeCategory(item))
      .filter((item: CourseCategory | null): item is CourseCategory => item !== null);
  } catch (error) {
    console.error("[courseApi] Error fetching categories:", error);
    return [];
  }
}

/**
 * Searches courses by title, description, or category
 */
export const searchCourses = async (query: string): Promise<Course[]> => {
  try {
    console.log("[courseApi] Searching courses with query:", query);
    const courses = await fetchCourses(true);
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return courses;

    const results = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.shortDescription.toLowerCase().includes(lowerQuery) ||
        (course.category?.toLowerCase().includes(lowerQuery) ?? false) ||
        (course.skills?.some((skill) => skill.toLowerCase().includes(lowerQuery)) ?? false),
    );

    console.log(`[courseApi] Found ${results.length} matching courses`);
    return results;
  } catch (error) {
    console.error("[courseApi] Error searching courses:", error);
    return [];
  }
};

/**
 * Filters courses by level
 */
export const filterCoursesByLevel = async (
  level: "beginner" | "intermediate" | "advanced",
): Promise<Course[]> => {
  try {
    console.log("[courseApi] Filtering courses by level:", level);
    const courses = await fetchCourses(true);
    return courses.filter((course) => course.level === level);
  } catch (error) {
    console.error("[courseApi] Error filtering courses:", error);
    return [];
  }
};

/**
 * Filters courses by category
 */
export const filterCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    console.log("[courseApi] Filtering courses by category:", category);
    const courses = await fetchCourses(true);
    return courses.filter((course) => course.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error("[courseApi] Error filtering courses:", error);
    return [];
  }
};

/**
 * Clears the course cache
 */
export const clearCourseCache = (): void => {
  try {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(CATEGORIES_CACHE_KEY);
    console.log("[courseApi] Course cache cleared successfully");
  } catch (error) {
    console.error("[courseApi] Error clearing cache:", error);
  }
};

/**
 * Gets cache statistics for debugging
 */
export const getCacheStats = (): { isCached: boolean; age?: number; entries?: number } | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) {
      return { isCached: false };
    }

    const cacheEntry = JSON.parse(cached) as { data: Course[]; timestamp: number };
    const age = Date.now() - cacheEntry.timestamp;
    const ageSeconds = Math.round(age / 1000);

    return {
      isCached: true,
      age: ageSeconds,
      entries: cacheEntry.data.length,
    };
  } catch (error) {
    console.error("[courseApi] Error getting cache stats:", error);
    return null;
  }
};

/**
 * Generates an apply URL for a specific course with UTM parameters.
 */
export const generateApplyUrl = async (
  courseIdOrSlug: string,
  utmParams?: { source?: string; medium?: string; campaign?: string },
): Promise<{ apply_url: string; course_id?: string; course_name?: string } | null> => {
  try {
    const url = `${PUBLIC_API_BASE}/${encodeURIComponent(courseIdOrSlug)}/apply-url`;
    console.log("[courseApi] Generating apply URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();

    if (!rawData.success || !rawData.data?.apply_url) {
      throw new Error(`API returned success: false or missing apply_url`);
    }

    let applyUrl = rawData.data.apply_url;

    // Append UTM parameters
    const utm = {
      utm_source: utmParams?.source || "main_site",
      utm_medium: utmParams?.medium || "web",
      ...(utmParams?.campaign ? { utm_campaign: utmParams.campaign } : {}),
    };

    const separator = applyUrl.includes("?") ? "&" : "?";
    const utmString = Object.entries(utm)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    applyUrl = `${applyUrl}${separator}${utmString}`;

    return {
      apply_url: applyUrl,
      course_id: rawData.data.course_id,
      course_name: rawData.data.course_name,
    };
  } catch (error) {
    console.error("[courseApi] Error generating apply URL:", error);

    // Fallback: construct URL manually from course data
    try {
      const course = await fetchCourseBySlug(courseIdOrSlug);
      if (course?.portalApplyUrl) {
        let fallbackUrl = course.portalApplyUrl;
        const utm = `utm_source=${utmParams?.source || "main_site"}&utm_medium=${utmParams?.medium || "web"}`;
        fallbackUrl += (fallbackUrl.includes("?") ? "&" : "?") + utm;
        return { apply_url: fallbackUrl };
      }
    } catch {
      // Ignore fallback errors
    }

    return null;
  }
};
