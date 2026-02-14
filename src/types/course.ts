// Type definitions for courses from the API
// Improved structure addressing API design best practices

// Raw API response types (what comes from backend)
export interface RawApiCourse {
  id: string
  moodleCourseId: string
  title: string
  slug: string
  description: string // HTML content
  shortDescription: string
  price: string
  currency: string
  durationWeeks: number | null
  level: string
  category: string | null
  thumbnailUrl: string | null
  status: 'active' | 'inactive' | 'archived'
  lastSyncedAt: string
  syncStatus: string
  lastSyncError: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface RawApiResponse {
  success: boolean
  message: string
  data: {
    data: RawApiCourse[]
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

// Transformed internal types (optimized for frontend use)
export interface Course {
  id: string
  title: string
  slug: string
  description: string // Plain text, sanitized
  shortDescription: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  image: string
  pricing: {
    amount: number
    currency: string
    isFree: boolean
  }
  duration: {
    weeks: number | null
    displayText: string
  }
  status: 'active' | 'inactive' | 'archived'
  // UI-specific fields
  instructor?: string
  skills?: string[]
  prerequisites?: string[]
  outcomes?: string[]
  enrollment?: {
    count: number
    capacity: number | null
  }
  startDate?: string
}

export interface CourseApiResponse {
  success: boolean
  message: string
  data: Course[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CourseError {
  message: string
  code?: string
  timestamp: number
  details?: Record<string, unknown>
}

/**
 * Strips HTML tags from text content
 * @param html Raw HTML content
 * @returns Plain text without HTML tags
 */
const stripHtmlTags = (html: string): string => {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}

/**
 * Validates raw API course data structure
 * @param data Unknown data to validate
 * @returns Type guard indicating if data is valid RawApiCourse
 */
export const validateRawApiCourse = (data: unknown): data is RawApiCourse => {
  if (typeof data !== 'object' || data === null) return false
  const course = data as Record<string, unknown>
  return (
    typeof course.id === 'string' &&
    typeof course.title === 'string' &&
    typeof course.description === 'string' &&
    typeof course.level === 'string'
  )
}

/**
 * Transforms raw API response to optimized internal format
 * Handles data normalization, sanitization, and enrichment
 * @param apiData Raw course data from API
 * @returns Transformed course or null if invalid
 */
export const transformCourseData = (apiData: unknown): Course | null => {
  try {
    if (!validateRawApiCourse(apiData)) {
      console.warn('[v0] Invalid course data structure:', apiData)
      return null
    }

    const raw = apiData as RawApiCourse

    // Determine level with fallback
    const levelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced',
      'basic': 'beginner',
      'intermediate ': 'intermediate',
      'expert': 'advanced',
    }
    const level = (levelMap[raw.level.toLowerCase()] || 'beginner') as 'beginner' | 'intermediate' | 'advanced'

    // Parse price safely
    const priceAmount = parseFloat(raw.price) || 0
    const isFree = priceAmount === 0

    // Generate display text for duration
    const durationWeeks = raw.durationWeeks || 0
    const durationDisplayText = durationWeeks > 0
      ? `${durationWeeks} weeks`
      : 'Self-paced'

    // Generate thumbnail URL with fallback
    const getThumbnailUrl = (): string => {
      if (raw.thumbnailUrl) return raw.thumbnailUrl
      // Generate a placeholder based on category or ID
      const categorySlug = (raw.category || 'course').toLowerCase().replace(/\s+/g, '-')
      return `https://via.placeholder.com/400x300?text=${encodeURIComponent(raw.title)}`
    }

    const course: Course = {
      id: raw.id,
      title: raw.title.trim(),
      slug: raw.slug,
      description: stripHtmlTags(raw.description),
      shortDescription: raw.shortDescription.trim(),
      level,
      category: raw.category || 'Uncategorized',
      image: getThumbnailUrl(),
      pricing: {
        amount: priceAmount,
        currency: raw.currency || 'GHS',
        isFree
      },
      duration: {
        weeks: raw.durationWeeks,
        displayText: durationDisplayText
      },
      status: raw.status as 'active' | 'inactive' | 'archived',
      // Default values for UI fields (can be populated from extended API)
      skills: [],
      prerequisites: [],
      outcomes: [],
      enrollment: {
        count: 0,
        capacity: null
      }
    }

    return course
  } catch (error) {
    console.error('[v0] Error transforming course data:', error)
    return null
  }
}

/**
 * Creates a mock course for demonstration/fallback
 * @param title Optional course title
 * @returns Mock course object
 */
export const createMockCourse = (title: string = 'Sample Course'): Course => {
  return {
    id: 'mock-' + Math.random().toString(36).substr(2, 9),
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    description: 'This is a sample course to demonstrate the platform.',
    shortDescription: 'Sample',
    level: 'beginner',
    category: 'Technology',
    image: 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(title),
    pricing: {
      amount: 0,
      currency: 'GHS',
      isFree: true
    },
    duration: {
      weeks: 8,
      displayText: '8 weeks'
    },
    status: 'active',
    skills: ['Sample Skill'],
    prerequisites: [],
    outcomes: [],
    enrollment: {
      count: 0,
      capacity: null
    }
  }
}
