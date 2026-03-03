// Type definitions for courses from the API

type CourseLevel = "beginner" | "intermediate" | "advanced";
type CourseStatus = "active" | "inactive" | "archived" | "draft";

// Current backend payload fields
export interface RawApiCourse {
  id: string;
  moodleCourseId?: string | null;
  shortName?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  summaryFormat?: number | null;
  category?: string | null;
  categoryId?: string | null;
  moodleCategoryId?: number | null;
  format?: string | null;
  price?: string | number | null;
  currency?: string | null;
  isFreeFlag?: boolean | null;
  durationWeeks?: number | null;
  level?: string | null;
  thumbnailUrl?: string | null;
  moodleImageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  isPublished?: boolean | null;
  needsReview?: boolean | null;
  syncedFromMoodle?: boolean | null;
  lastSyncedAt?: string | null;
  syncStatus?: string | null;
  lastSyncError?: string | null;
  enrollmentKey?: string | null;
  maxStudents?: number | null;
  language?: string | null;
  tags?: string[];
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  enrollmentCount?: number | null;
  portalApplyUrl?: string | null;
}

// Legacy field support kept for rollout safety
interface LegacyRawApiCourse {
  full_name?: string;
  short_name?: string | null;
  summary?: string | null;
  image_url?: string | null;
  is_free?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  enrollment_count?: number;
  duration_weeks?: number | null;
  portal_apply_url?: string | null;
  category_id?: string | null;
}

export interface RawApiResponse {
  success: boolean;
  message: string;
  data: {
    data?: RawApiCourse[];
    courses?: RawApiCourse[]; // Legacy fallback
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Transformed internal types (used across UI)
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  level: CourseLevel;
  category: string;
  image: string;
  pricing: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  duration: {
    weeks: number | null;
    displayText: string;
  };
  status: CourseStatus;
  portalApplyUrl: string;
  instructor?: string;
  skills?: string[];
  prerequisites?: string[];
  outcomes?: string[];
  enrollment?: {
    count: number;
    capacity: number | null;
  };
  startDate?: string;
  endDate?: string;
  // Extra backend fields retained for future UI use
  moodleCourseId?: string | null;
  shortName?: string | null;
  categoryId?: string | null;
  moodleCategoryId?: number | null;
  format?: string | null;
  isPublished?: boolean;
  needsReview?: boolean;
  syncStatus?: string | null;
  language?: string | null;
  lastSyncedAt?: string | null;
}

export interface CourseApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Course[];
    pagination: RawApiResponse["data"]["pagination"];
  };
}

export interface CourseError {
  message: string;
  code?: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string | null;
  course_count: number;
}

const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const normalizeDate = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  return dateOnly || value;
};

const parsePrice = (value: string | number | null | undefined): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const mapLevel = (value: string | null | undefined): CourseLevel => {
  const levelMap: Record<string, CourseLevel> = {
    beginner: "beginner",
    basic: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
    expert: "advanced",
  };
  if (!value) return "beginner";
  return levelMap[value.trim().toLowerCase()] || "beginner";
};

const mapStatus = (value: string | null | undefined, isPublished?: boolean | null): CourseStatus => {
  if (!value) {
    return isPublished === false ? "inactive" : "active";
  }

  const normalized = value.toLowerCase();
  if (normalized === "active" || normalized === "inactive" || normalized === "archived") {
    return normalized;
  }
  if (normalized === "draft" || normalized === "pending") {
    return "draft";
  }
  return isPublished === false ? "inactive" : "active";
};

/**
 * Validates raw API course data structure
 */
export const validateRawApiCourse = (data: unknown): data is RawApiCourse => {
  if (typeof data !== "object" || data === null) return false;
  const course = data as Record<string, unknown>;
  const title = course.title ?? course.full_name;
  return typeof course.id === "string" && typeof title === "string";
};

/**
 * Transforms raw API response to optimized internal format
 */
export const transformCourseData = (apiData: unknown): Course | null => {
  try {
    if (!validateRawApiCourse(apiData)) {
      console.warn("[course] Invalid course data structure:", apiData);
      return null;
    }

    const raw = apiData as RawApiCourse & LegacyRawApiCourse;
    const title = (raw.title || raw.full_name || "Untitled Course").trim();
    const description = stripHtmlTags(raw.description || raw.summary || "");
    const shortDescription = stripHtmlTags(raw.shortDescription || description.slice(0, 150) || "");
    const durationWeeks = raw.durationWeeks ?? raw.duration_weeks ?? null;
    const priceAmount = parsePrice(raw.price);
    const isFree = Boolean(raw.isFreeFlag ?? raw.is_free) || priceAmount === 0;
    const image =
      raw.thumbnailUrl ||
      raw.moodleImageUrl ||
      raw.image_url ||
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(title)}`;

    const course: Course = {
      id: raw.id,
      title,
      slug: raw.slug?.trim() || slugify(title),
      description,
      shortDescription,
      level: mapLevel(raw.level),
      category: raw.category || "Uncategorized",
      image,
      pricing: {
        amount: priceAmount,
        currency: raw.currency || "GHS",
        isFree,
      },
      duration: {
        weeks: durationWeeks,
        displayText:
          typeof durationWeeks === "number" && durationWeeks > 0
            ? `${durationWeeks} weeks`
            : "Self-paced",
      },
      status: mapStatus(raw.status, raw.isPublished),
      portalApplyUrl:
        raw.portalApplyUrl ||
        raw.portal_apply_url ||
        `https://portal.itforyouthghana.org/register?course_id=${encodeURIComponent(raw.id)}`,
      skills: Array.isArray(raw.tags) ? raw.tags : [],
      prerequisites: [],
      outcomes: [],
      enrollment: {
        count: raw.enrollmentCount ?? raw.enrollment_count ?? 0,
        capacity: raw.maxStudents ?? null,
      },
      startDate: normalizeDate(raw.startDate || raw.start_date),
      endDate: normalizeDate(raw.endDate || raw.end_date),
      moodleCourseId: raw.moodleCourseId ?? null,
      shortName: raw.shortName ?? raw.short_name ?? null,
      categoryId: raw.categoryId ?? raw.category_id ?? null,
      moodleCategoryId: raw.moodleCategoryId ?? null,
      format: raw.format ?? null,
      isPublished: raw.isPublished ?? undefined,
      needsReview: raw.needsReview ?? undefined,
      syncStatus: raw.syncStatus ?? null,
      language: raw.language ?? null,
      lastSyncedAt: raw.lastSyncedAt ?? null,
    };

    return course;
  } catch (error) {
    console.error("[course] Error transforming course data:", error);
    return null;
  }
};

export const createMockCourse = (title: string = "Sample Course"): Course => {
  return {
    id: "mock-" + Math.random().toString(36).substr(2, 9),
    title,
    slug: slugify(title),
    description: "This is a sample course to demonstrate the platform.",
    shortDescription: "Sample",
    level: "beginner",
    category: "Technology",
    image: "https://via.placeholder.com/400x300?text=" + encodeURIComponent(title),
    pricing: {
      amount: 0,
      currency: "GHS",
      isFree: true,
    },
    duration: {
      weeks: 8,
      displayText: "8 weeks",
    },
    status: "active",
    portalApplyUrl: "https://portal.itforyouthghana.org",
    skills: ["Sample Skill"],
    prerequisites: [],
    outcomes: [],
    enrollment: {
      count: 0,
      capacity: null,
    },
  };
};
