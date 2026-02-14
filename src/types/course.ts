// Type definitions for courses from the API

export interface Course {
  id: string
  title: string
  description: string
  image: string
  duration: string
  level: string
  category: string
  instructor?: string
  capacity?: number
  enrolled?: number
  skills?: string[]
  requirements?: string
  startDate?: string
  highlights?: string[]
  careerOutcomes?: string[]
}

export interface CourseApiResponse {
  success: boolean
  data: Course[]
  message?: string
}

export interface CourseError {
  message: string
  code?: string
  timestamp: number
}

// Utility function to validate course data
export const validateCourse = (data: unknown): data is Course => {
  if (typeof data !== 'object' || data === null) return false
  const course = data as Record<string, unknown>
  return (
    typeof course.id === 'string' &&
    typeof course.title === 'string' &&
    typeof course.description === 'string' &&
    typeof course.image === 'string' &&
    typeof course.duration === 'string' &&
    typeof course.level === 'string' &&
    typeof course.category === 'string'
  )
}

// Utility function to transform API response to internal format
export const transformCourseData = (apiData: unknown): Course | null => {
  try {
    if (!validateCourse(apiData)) return null
    
    const course = apiData as Course
    return {
      id: course.id || '',
      title: course.title || 'Untitled Course',
      description: course.description || '',
      image: course.image || '/images/default-course.jpg',
      duration: course.duration || 'Unknown',
      level: course.level || 'Beginner',
      category: course.category || 'General',
      instructor: course.instructor,
      capacity: course.capacity,
      enrolled: course.enrolled,
      skills: course.skills || [],
      requirements: course.requirements,
      startDate: course.startDate,
      highlights: course.highlights,
      careerOutcomes: course.careerOutcomes
    }
  } catch (error) {
    console.error('[v0] Error transforming course data:', error)
    return null
  }
}
