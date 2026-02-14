// API data access layer for course-related operations
import { Course, CourseApiResponse, transformCourseData } from '../../types/course'

// Configuration
const COURSE_API_ENDPOINT = 'https://portal.itforyouthghana.org/api/courses'
const CACHE_KEY = 'courses_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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

// Main function to fetch courses from API
export const fetchCourses = async (
  useCache: boolean = true,
  retries: number = 3
): Promise<Course[]> => {
  try {
    // Check cache first
    if (useCache) {
      const cachedCourses = getCachedCourses()
      if (cachedCourses) {
        console.log('[v0] Using cached courses')
        return cachedCourses
      }
    }

    console.log('[v0] Fetching courses from API...')

    let lastError: Error | null = null
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(COURSE_API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const responseData: CourseApiResponse = await response.json()

        // Validate response structure
        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error('Invalid API response structure')
        }

        // Transform and validate each course
        const courses = responseData.data
          .map(transformCourseData)
          .filter((course): course is Course => course !== null)

        if (courses.length === 0) {
          console.warn('[v0] No valid courses received from API')
        }

        // Cache the results
        setCachedCourses(courses)
        console.log(`[v0] Successfully fetched ${courses.length} courses`)
        return courses
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        // If this is the last retry, throw the error
        if (attempt === retries - 1) {
          throw lastError
        }

        // Wait before retrying (exponential backoff)
        const delayMs = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    throw lastError || new Error('Failed to fetch courses after retries')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Error fetching courses:', errorMessage)
    throw new Error(`Failed to fetch courses: ${errorMessage}`)
  }
}

// Function to get a single course by ID
export const fetchCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const courses = await fetchCourses(true)
    return courses.find(course => course.id === courseId) || null
  } catch (error) {
    console.error('[v0] Error fetching course by ID:', error)
    return null
  }
}

// Function to search courses
export const searchCourses = async (query: string): Promise<Course[]> => {
  try {
    const courses = await fetchCourses(true)
    const lowerQuery = query.toLowerCase()
    
    return courses.filter(course =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      (course.category?.toLowerCase().includes(lowerQuery) ?? false)
    )
  } catch (error) {
    console.error('[v0] Error searching courses:', error)
    return []
  }
}

// Function to clear cache
export const clearCourseCache = (): void => {
  try {
    sessionStorage.removeItem(CACHE_KEY)
    console.log('[v0] Course cache cleared')
  } catch (error) {
    console.error('[v0] Error clearing cache:', error)
  }
}
