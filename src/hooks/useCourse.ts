// Hook for fetching a single course by slug or ID
// Uses fetchCourseBySlug which hits the detail endpoint directly
// — more efficient than loading all courses and doing .find()
import { useEffect, useState, useCallback } from "react"
import type { Course } from "../types/course"
import { fetchCourseBySlug } from "../lib/api/courseApi"

interface UseCourseReturn {
  course: Course | null
  loading: boolean
  error: Error | null
  retry: () => void
}

export const useCourse = (slugOrId: string | undefined): UseCourseReturn => {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<Error | null>(null)

  const load = useCallback(async () => {
    if (!slugOrId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("[useCourse] Fetching course:", slugOrId)

      const result = await fetchCourseBySlug(slugOrId)

      setCourse(result)
      if (!result) {
        console.warn("[useCourse] Course not found:", slugOrId)
      } else {
        console.log("[useCourse] Course loaded:", result.title)
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      setCourse(null)
      console.error("[useCourse] Error loading course:", e.message)
    } finally {
      setLoading(false)
    }
  }, [slugOrId])

  useEffect(() => {
    load()
  }, [load])

  const retry = useCallback(() => {
    console.log("[useCourse] Retrying:", slugOrId)
    load()
  }, [load, slugOrId])

  return { course, loading, error, retry }
}

export default useCourse
