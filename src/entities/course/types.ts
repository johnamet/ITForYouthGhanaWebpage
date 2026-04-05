/**
 * Course/Program entity types
 */

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  shortDescription?: string
  category: string
  instructor?: string
  duration?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  image?: string
  learningOutcomes?: string[]
  prerequisites?: string[]
  schedule?: string
  fee?: number
  isFree?: boolean
}

export interface CourseCategory {
  id: string
  name: string
  slug: string
  description?: string
  courseCount: number
}

export interface CourseFilters {
  category?: string
  level?: string
  search?: string
  sort?: 'newest' | 'popular' | 'title'
}

export interface CoursesResponse {
  courses: Course[]
  categories: CourseCategory[]
  filters: CourseFilters
  total: number
}
