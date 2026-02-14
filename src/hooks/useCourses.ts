// Custom React hook for fetching and managing courses
import { useEffect, useState, useCallback } from 'react'
import { Course } from '../types/course'
import { fetchCourses } from '../lib/api/courseApi'

interface UseCoursesReturn {
  courses: Course[]
  loading: boolean
  error: Error | null
  retry: () => void
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('[v0] useCourses: Loading courses...')
      const fetchedCourses = await fetchCourses(true)
      
      setCourses(fetchedCourses)
      console.log('[v0] useCourses: Courses loaded successfully')
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      console.error('[v0] useCourses: Error loading courses:', error.message)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const retry = useCallback(() => {
    console.log('[v0] useCourses: Retrying...')
    loadCourses()
  }, [loadCourses])

  return {
    courses,
    loading,
    error,
    retry
  }
}

export default useCourses
