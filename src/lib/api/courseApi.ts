// API data access layer for course-related operations
// Handles data transformation, caching, and error recovery
import {
  Course,
  CourseApiResponse,
  RawApiResponse,
  transformCourseData,
  createMockCourse
} from '../../types/course'

// Configuration
const COURSE_API_ENDPOINT = 'https://portal.itforyouthghana.org/api/courses'
const CACHE_KEY = 'courses_cache_v2' // v2 indicates new structure
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const REQUEST_TIMEOUT = 10000 // 10 seconds
const MAX_RETRIES = 3

interface CacheEntry {
  data: Course[]
  timestamp: number
}

// Utility function to check if cache is valid
const isCacheValid = (cache: CacheEntry | null): boolean => {
  if (!cache) return false
  const now = Date.now()
  return now - cache.timestamp < CACHE_DURATION
}

// Utility function to get cached courses
const getCachedCourses = (): Course[] | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const cacheEntry: CacheEntry = JSON.parse(cached)
    if (!isCacheValid(cacheEntry)) {
      sessionStorage.removeItem(CACHE_KEY)
      return null
    }

    return cacheEntry.data
  } catch (error) {
    console.error('[v0] Error reading course cache:', error)
    return null
  }
}

// Utility function to cache courses
const setCachedCourses = (courses: Course[]): void => {
  try {
    const cacheEntry: CacheEntry = {
      data: courses,
      timestamp: Date.now()
    }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry))
  } catch (error) {
    console.error('[v0] Error caching courses:', error)
  }
}

/**
 * Fetches courses from the API with caching and retry logic
 * Handles the nested API response structure properly
 * @param useCache Whether to use cached data
 * @param retries Number of retry attempts
 * @returns Array of transformed courses
 * @throws Error if all retry attempts fail
 */
export const fetchCourses = async (
  useCache: boolean = true,
  retries: number = MAX_RETRIES
): Promise<Course[]> => {
  try {
    // Check cache first
    if (useCache) {
      const cachedCourses = getCachedCourses()
      if (cachedCourses) {
        console.log('[v0] Using cached courses, count:', cachedCourses.length)
        return cachedCourses
      }
    }

    console.log('[v0] Fetching courses from API:', COURSE_API_ENDPOINT)

    let lastError: Error | null = null

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(COURSE_API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT)
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const rawData = await response.json()
        console.log('[v0] Raw API response received, validating structure')

        // Handle the nested data.data structure from the API
        const responseData = rawData as RawApiResponse

        // Validate outer response structure
        if (!responseData.success) {
          throw new Error(`API returned success: false - ${responseData.message}`)
        }

        // Navigate the nested data structure: data.data
        const courseArray = responseData.data?.data
        if (!Array.isArray(courseArray)) {
          console.error('[v0] Unexpected data structure:', responseData)
          throw new Error('Invalid API response: data.data is not an array')
        }

        console.log('[v0] Processing', courseArray.length, 'courses from API')

        // Transform and validate each course
        const courses = courseArray
          .map((rawCourse, index) => {
            try {
              return transformCourseData(rawCourse)
            } catch (error) {
              console.warn(`[v0] Failed to transform course at index ${index}:`, error)
              return null
            }
          })
          .filter((course): course is Course => course !== null)

        if (courses.length === 0) {
          console.warn('[v0] No valid courses after transformation')
          // Don't fail - return empty array to allow UI to show empty state
        } else {
          console.log(`[v0] Successfully transformed ${courses.length} courses`)
        }

        // Cache the results
        setCachedCourses(courses)
        return courses
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.warn(`[v0] Fetch attempt ${attempt + 1}/${retries} failed:`, lastError.message)

        // If this is the last retry, log and prepare to throw
        if (attempt === retries - 1) {
          console.error('[v0] All retry attempts exhausted')
          throw lastError
        }

        // Wait before retrying (exponential backoff)
        const delayMs = Math.pow(2, attempt) * 1000
        console.log(`[v0] Retrying in ${delayMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    throw lastError || new Error('Failed to fetch courses after all retries')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Course fetch failed:', errorMessage)
    throw new Error(`Failed to fetch courses: ${errorMessage}`)
  }
}

/**
 * Fetches a single course by ID
 * @param courseId Course identifier
 * @returns Course object or null if not found
 */
export const fetchCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    console.log('[v0] Fetching course by ID:', courseId)
    const courses = await fetchCourses(true)
    const course = courses.find(course => course.id === courseId) || null
    
    if (!course) {
      console.warn('[v0] Course not found:', courseId)
    }
    
    return course
  } catch (error) {
    console.error('[v0] Error fetching course by ID:', error)
    return null
  }
}

/**
 * Searches courses by title, description, or category
 * @param query Search query string
 * @returns Array of matching courses
 */
export const searchCourses = async (query: string): Promise<Course[]> => {
  try {
    console.log('[v0] Searching courses with query:', query)
    const courses = await fetchCourses(true)
    const lowerQuery = query.toLowerCase().trim()

    if (!lowerQuery) return courses

    const results = courses.filter(course =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.shortDescription.toLowerCase().includes(lowerQuery) ||
      (course.category?.toLowerCase().includes(lowerQuery) ?? false) ||
      (course.skills?.some(skill => skill.toLowerCase().includes(lowerQuery)) ?? false)
    )

    console.log(`[v0] Found ${results.length} matching courses`)
    return results
  } catch (error) {
    console.error('[v0] Error searching courses:', error)
    return []
  }
}

/**
 * Filters courses by level
 * @param level Course difficulty level
 * @returns Array of courses at specified level
 */
export const filterCoursesByLevel = async (level: 'beginner' | 'intermediate' | 'advanced'): Promise<Course[]> => {
  try {
    console.log('[v0] Filtering courses by level:', level)
    const courses = await fetchCourses(true)
    return courses.filter(course => course.level === level)
  } catch (error) {
    console.error('[v0] Error filtering courses:', error)
    return []
  }
}

/**
 * Filters courses by category
 * @param category Course category
 * @returns Array of courses in specified category
 */
export const filterCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    console.log('[v0] Filtering courses by category:', category)
    const courses = await fetchCourses(true)
    return courses.filter(course => course.category.toLowerCase() === category.toLowerCase())
  } catch (error) {
    console.error('[v0] Error filtering courses:', error)
    return []
  }
}

/**
 * Clears the course cache
 * Useful for forcing a refresh of course data
 */
export const clearCourseCache = (): void => {
  try {
    sessionStorage.removeItem(CACHE_KEY)
    console.log('[v0] Course cache cleared successfully')
  } catch (error) {
    console.error('[v0] Error clearing cache:', error)
  }
}

/**
 * Gets cache statistics for debugging
 * @returns Cache info including age and entry count
 */
export const getCacheStats = (): { isCached: boolean; age?: number; entries?: number } | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (!cached) {
      return { isCached: false }
    }

    const cacheEntry = JSON.parse(cached) as { data: Course[]; timestamp: number }
    const age = Date.now() - cacheEntry.timestamp
    const ageSeconds = Math.round(age / 1000)

    return {
      isCached: true,
      age: ageSeconds,
      entries: cacheEntry.data.length
    }
  } catch (error) {
    console.error('[v0] Error getting cache stats:', error)
    return null
  }
}
