import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import type { PageMeta } from '../types'

/**
 * Hook for managing page metadata (title, description, etc.)
 */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    // Update document title
    document.title = meta.title
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description)
    }
  }, [meta.title, meta.description])

  return meta
}
