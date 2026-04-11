// Type definitions for courses — reflects full API payload shape
// Last updated to match: { id, teachers[], modules[], deliveryProvider, progressSource, ... }

// ─── Primitive aliases ────────────────────────────────────────────────────────
export type CourseLevel  = "beginner" | "intermediate" | "advanced"
export type CourseStatus = "active" | "inactive" | "archived" | "draft"

// ─── Sub-types matching payload exactly ──────────────────────────────────────

/** A single teacher/instructor as returned by the API */
export interface RawTeacher {
  id: string
  firstName: string
  lastName: string
  email: string
}

/** A course module as returned by the API (schema may grow) */
export interface RawModule {
  id?: string
  name?: string
  description?: string | null
  sequence?: number | null
  [key: string]: unknown
}

// ─── Raw API shapes ───────────────────────────────────────────────────────────

/** Full payload shape from /api/courses and /api/public/courses/:slug */
export interface RawApiCourse {
  // Core identity
  id: string
  moodleCourseId?: string | null
  shortName?: string | null
  title?: string | null
  slug?: string | null

  // Content
  description?: string | null
  shortDescription?: string | null
  summaryFormat?: number | null

  // Classification
  category?: string | null
  categoryId?: string | null
  moodleCategoryId?: number | null
  tags?: string[] | null

  // Delivery
  deliveryProvider?: string | null   // e.g. "moodle"
  progressSource?: string | null     // e.g. "moodle"
  format?: string | null             // e.g. "topics"
  language?: string | null

  // Pricing
  price?: string | number | null
  currency?: string | null
  isFreeFlag?: boolean | null

  // Schedule
  durationWeeks?: number | null
  startDate?: string | null
  endDate?: string | null

  // Media
  thumbnailUrl?: string | null
  moodleImageUrl?: string | null

  // Lifecycle & visibility
  status?: string | null
  isPublished?: boolean | null
  needsReview?: boolean | null

  // Moodle sync
  syncedFromMoodle?: boolean | null
  lastSyncedAt?: string | null
  syncStatus?: string | null
  lastSyncError?: string | null

  // Enrollment
  enrollmentKey?: string | null
  maxStudents?: number | null
  enrollmentCount?: number | null

  // Relationships
  teachers?: RawTeacher[] | null
  modules?: RawModule[] | null

  // Audit
  createdBy?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  deletedAt?: string | null

  // Portal
  portalApplyUrl?: string | null
}

/** Legacy snake_case shape — kept for rollout safety */
interface LegacyRawApiCourse {
  full_name?: string
  short_name?: string | null
  summary?: string | null
  image_url?: string | null
  is_free?: boolean
  start_date?: string | null
  end_date?: string | null
  enrollment_count?: number
  duration_weeks?: number | null
  portal_apply_url?: string | null
  category_id?: string | null
}

// ─── API response envelopes ───────────────────────────────────────────────────

export interface RawApiResponse {
  success: boolean
  message: string
  data: {
    data?: RawApiCourse[]
    courses?: RawApiCourse[]       // Legacy fallback
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

// ─── Transformed / internal types ─────────────────────────────────────────────

/** A teacher after transformation — names trimmed and merged */
export interface Teacher {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
}

/** A course module after transformation */
export interface CourseModule {
  id: string
  name: string
  description: string | null
  sequence: number | null
  [key: string]: unknown
}

/** The canonical Course shape used across the UI */
export interface Course {
  // Core identity
  id: string
  title: string
  slug: string

  // Content
  description: string
  shortDescription: string

  // Classification
  level: CourseLevel
  category: string
  tags: string[]          // raw tags from payload (searchable labels)

  // Media
  image: string

  // Pricing
  pricing: {
    amount: number
    currency: string
    isFree: boolean
  }

  // Schedule
  duration: {
    weeks: number | null
    displayText: string
  }
  startDate?: string
  endDate?: string

  // Lifecycle
  status: CourseStatus
  isPublished: boolean
  needsReview: boolean

  // Enrollment
  enrollment: {
    count: number
    capacity: number | null
    key: string | null
  }

  // Delivery
  deliveryProvider: string | null
  progressSource: string | null
  format: string | null
  language: string | null

  // Relationships
  teachers: Teacher[]
  modules: CourseModule[]

  // Portal
  portalApplyUrl: string

  // Moodle sync metadata
  moodleCourseId: string | null
  shortName: string | null
  categoryId: string | null
  moodleCategoryId: number | null
  syncedFromMoodle: boolean
  syncStatus: string | null
  lastSyncedAt: string | null
  lastSyncError: string | null

  // Audit
  createdBy: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
}

export interface CourseApiResponse {
  success: boolean
  message: string
  data: {
    data: Course[]
    pagination: RawApiResponse["data"]["pagination"]
  }
}

export interface CourseError {
  message: string
  code?: string
  timestamp: number
  details?: Record<string, unknown>
}

export interface CourseCategory {
  id: string
  name: string
  description: string | null
  course_count: number
}

// ─── Utility helpers ──────────────────────────────────────────────────────────

const stripHtmlTags = (html: string): string => {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

const normalizeDate = (value?: string | null): string | undefined => {
  if (!value) return undefined
  return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? value
}

const parsePrice = (value: string | number | null | undefined): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  if (typeof value === "string") {
    const parsed = parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const mapLevel = (value: string | null | undefined): CourseLevel => {
  const map: Record<string, CourseLevel> = {
    beginner: "beginner",
    basic: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
    expert: "advanced",
  }
  if (!value) return "beginner"
  return map[value.trim().toLowerCase()] ?? "beginner"
}

const mapStatus = (
  value: string | null | undefined,
  isPublished?: boolean | null,
): CourseStatus => {
  if (!value) return isPublished === false ? "inactive" : "active"
  const n = value.toLowerCase()
  if (n === "active" || n === "inactive" || n === "archived") return n
  if (n === "draft" || n === "pending") return "draft"
  return isPublished === false ? "inactive" : "active"
}

/** Transforms a raw teacher record into a clean Teacher object */
const mapTeacher = (raw: unknown): Teacher | null => {
  if (typeof raw !== "object" || raw === null) return null
  const t = raw as Record<string, unknown>
  if (typeof t.id !== "string" || typeof t.firstName !== "string") return null

  const firstName = String(t.firstName).trim()
  const lastName  = typeof t.lastName === "string" ? t.lastName.trim() : ""

  return {
    id: t.id,
    firstName,
    lastName,
    fullName: [firstName, lastName].filter(Boolean).join(" "),
    email: typeof t.email === "string" ? t.email.trim() : "",
  }
}

/** Transforms a raw module record into a clean CourseModule object */
const mapModule = (raw: unknown, index: number): CourseModule | null => {
  if (typeof raw !== "object" || raw === null) return null
  const m = raw as Record<string, unknown>
  return {
    id: typeof m.id === "string" ? m.id : `module-${index}`,
    name: typeof m.name === "string" ? m.name.trim() : `Module ${index + 1}`,
    description: typeof m.description === "string" ? m.description : null,
    sequence: typeof m.sequence === "number" ? m.sequence : index,
    ...m,
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

export const validateRawApiCourse = (data: unknown): data is RawApiCourse => {
  if (typeof data !== "object" || data === null) return false
  const c = data as Record<string, unknown>
  const title = c.title ?? c.full_name
  return typeof c.id === "string" && typeof title === "string"
}

// ─── Transform ────────────────────────────────────────────────────────────────

/**
 * Transforms a raw API course payload into the internal Course shape.
 * Every field from the payload is accounted for — nothing is silently dropped.
 */
export const transformCourseData = (apiData: unknown): Course | null => {

  console.log("[course] Transforming course data:", apiData)
  try {
    if (!validateRawApiCourse(apiData)) {
      console.warn("[course] Invalid course data structure:", apiData)
      return null
    }

    const raw = apiData as RawApiCourse & LegacyRawApiCourse

    // ── Content ──────────────────────────────────────────────────────────────
    const title            = (raw.title || raw.full_name || "Untitled Course").trim()
    const description      = (raw.description || raw.summary || "")
    const shortDescription = (raw.shortDescription || description.slice(0, 160) || "")

    // ── Pricing ──────────────────────────────────────────────────────────────
    const priceAmount = parsePrice(raw.price)
    const isFree      = Boolean(raw.isFreeFlag ?? raw.is_free) || priceAmount === 0

    // ── Duration ─────────────────────────────────────────────────────────────
    const durationWeeks = raw.durationWeeks ?? raw.duration_weeks ?? null

    // ── Image ────────────────────────────────────────────────────────────────
    const image =
      raw.thumbnailUrl ||
      raw.moodleImageUrl ||
      raw.image_url ||
      `https://via.placeholder.com/600x400?text=${encodeURIComponent(title)}`

    // ── Teachers ─────────────────────────────────────────────────────────────
    const teachers: Teacher[] = Array.isArray(raw.teachers)
      ? (raw.teachers.map(mapTeacher).filter((t): t is Teacher => t !== null))
      : []

    // ── Modules ──────────────────────────────────────────────────────────────
    const modules: CourseModule[] = Array.isArray(raw.modules)
      ? (raw.modules.map(mapModule).filter((m): m is CourseModule => m !== null))
      : []

    // ── Tags ─────────────────────────────────────────────────────────────────
    const tags: string[] = Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : []

    // ── Portal URL ───────────────────────────────────────────────────────────
    const portalApplyUrl =
      raw.portalApplyUrl ||
      raw.portal_apply_url ||
      `https://portal.itforyouthghana.org/register?course_id=${encodeURIComponent(raw.id)}`

    const course: Course = {
      // Core identity
      id:    raw.id,
      title,
      slug:  raw.slug?.trim() || slugify(title),

      // Content
      description,
      shortDescription,

      // Classification
      level:    mapLevel(raw.level),
      category: raw.category || "Uncategorized",
      tags,

      // Media
      image,

      // Pricing
      pricing: {
        amount:   priceAmount,
        currency: raw.currency || "GHS",
        isFree,
      },

      // Schedule
      duration: {
        weeks:       durationWeeks,
        displayText: typeof durationWeeks === "number" && durationWeeks > 0
          ? `${durationWeeks} week${durationWeeks !== 1 ? "s" : ""}`
          : "Self-paced",
      },
      startDate: normalizeDate(raw.startDate || raw.start_date),
      endDate:   normalizeDate(raw.endDate   || raw.end_date),

      // Lifecycle
      status:      mapStatus(raw.status, raw.isPublished),
      isPublished: raw.isPublished ?? true,
      needsReview: raw.needsReview ?? false,

      // Enrollment
      enrollment: {
        count:    raw.enrollmentCount ?? raw.enrollment_count ?? 0,
        capacity: raw.maxStudents ?? null,
        key:      raw.enrollmentKey ?? null,
      },

      // Delivery
      deliveryProvider: raw.deliveryProvider ?? null,
      progressSource:   raw.progressSource   ?? null,
      format:           raw.format           ?? null,
      language:         raw.language         ?? null,

      // Relationships
      teachers,
      modules,

      // Portal
      portalApplyUrl,

      // Moodle sync metadata
      moodleCourseId:   raw.moodleCourseId               ?? null,
      shortName:        raw.shortName ?? raw.short_name  ?? null,
      categoryId:       raw.categoryId ?? raw.category_id ?? null,
      moodleCategoryId: raw.moodleCategoryId              ?? null,
      syncedFromMoodle: raw.syncedFromMoodle              ?? false,
      syncStatus:       raw.syncStatus                    ?? null,
      lastSyncedAt:     raw.lastSyncedAt                  ?? null,
      lastSyncError:    raw.lastSyncError                 ?? null,

      // Audit
      createdBy: raw.createdBy ?? null,
      createdAt: raw.createdAt ?? null,
      updatedAt: raw.updatedAt ?? null,
      deletedAt: raw.deletedAt ?? null,
    }

    return course
  } catch (error) {
    console.error("[course] Error transforming course data:", error)
    return null
  }
}

// ─── Mock factory ─────────────────────────────────────────────────────────────

export const createMockCourse = (title = "Sample Course"): Course => ({
  id:               "mock-" + Math.random().toString(36).slice(2, 9),
  title,
  slug:             slugify(title),
  description:      "This is a sample course to demonstrate the platform.",
  shortDescription: "Sample course",
  level:            "beginner",
  category:         "Technology",
  tags:             ["sample", "technology"],
  image:            `https://via.placeholder.com/600x400?text=${encodeURIComponent(title)}`,
  pricing:          { amount: 0, currency: "GHS", isFree: true },
  duration:         { weeks: 8, displayText: "8 weeks" },
  startDate:        undefined,
  endDate:          undefined,
  status:           "active",
  isPublished:      true,
  needsReview:      false,
  enrollment:       { count: 0, capacity: null, key: null },
  deliveryProvider: "moodle",
  progressSource:   "moodle",
  format:           "topics",
  language:         "en",
  teachers:         [],
  modules:          [],
  portalApplyUrl:   "https://portal.itforyouthghana.org",
  moodleCourseId:   null,
  shortName:        null,
  categoryId:       null,
  moodleCategoryId: null,
  syncedFromMoodle: false,
  syncStatus:       null,
  lastSyncedAt:     null,
  lastSyncError:    null,
  createdBy:        null,
  createdAt:        null,
  updatedAt:        null,
  deletedAt:        null,
})
