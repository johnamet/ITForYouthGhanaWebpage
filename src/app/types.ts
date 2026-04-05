/**
 * App-level type definitions
 */

export interface RouteHandle {
  title?: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  access?: 'public' | 'authenticated' | 'admin'
  keywords?: string[]
}

export interface Breadcrumb {
  label: string
  path: string
}

export interface PageMeta {
  title: string
  description: string
  image?: string
  canonical?: string
  keywords?: string[]
}

export interface LoaderData<T = unknown> {
  data: T
  error?: string
}
