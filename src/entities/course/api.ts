/**
 * Course/Program API calls
 */

import type { Course, CourseCategory, CoursesResponse, CourseFilters } from './types'

// Mock data - replace with actual API calls
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    slug: 'web-development',
    title: 'Web Development Bootcamp',
    description: 'Learn modern web development with React, Node.js, and more',
    category: 'web-dev',
    level: 'beginner',
    duration: '12 weeks',
    isFree: false,
  },
  {
    id: '2',
    slug: 'digital-marketing',
    title: 'Digital Marketing Essentials',
    description: 'Master digital marketing strategies and tools',
    category: 'marketing',
    level: 'intermediate',
    duration: '8 weeks',
    isFree: true,
  },
]

const MOCK_CATEGORIES: CourseCategory[] = [
  { id: '1', name: 'Web Development', slug: 'web-dev', courseCount: 5 },
  { id: '2', name: 'Digital Marketing', slug: 'marketing', courseCount: 3 },
  { id: '3', name: 'IT Skills', slug: 'it-skills', courseCount: 8 },
]

export const courseApi = {
  /**
   * Get all courses with optional filters
   */
  getAll: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filtered = [...MOCK_COURSES]
    
    if (filters?.category) {
      filtered = filtered.filter(c => c.category === filters.category)
    }
    
    if (filters?.level) {
      filtered = filtered.filter(c => c.level === filters.level)
    }
    
    if (filters?.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      )
    }

    return {
      courses: filtered,
      categories: MOCK_CATEGORIES,
      filters: filters || {},
      total: filtered.length,
    }
  },

  /**
   * Get a single course by slug
   */
  getBySlug: async (slug: string): Promise<Course | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return MOCK_COURSES.find(c => c.slug === slug) || null
  },

  /**
   * Get courses by category
   */
  getByCategory: async (category: string): Promise<Course[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return MOCK_COURSES.filter(c => c.category === category)
  },

  /**
   * Search courses
   */
  search: async (query: string): Promise<Course[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const q = query.toLowerCase()
    return MOCK_COURSES.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    )
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<CourseCategory[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return MOCK_CATEGORIES
  },
}
