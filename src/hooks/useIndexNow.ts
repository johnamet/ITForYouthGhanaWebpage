import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { submitCurrentPage } from '../utils/indexnow'

/**
 * Hook to submit page URL to IndexNow when navigation changes
 * This ensures search engines are notified of new/updated content
 */
export function useIndexNow(): void {
  const location = useLocation()

  useEffect(() => {
    // Submit current page to IndexNow when route changes
    submitCurrentPage()
  }, [location.pathname])
}
