/**
 * Common types used across the application
 */

export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}

export interface FilterOptions {
  [key: string]: string | number | boolean | string[]
}

export interface SortOption {
  field: string
  order: 'asc' | 'desc'
}
