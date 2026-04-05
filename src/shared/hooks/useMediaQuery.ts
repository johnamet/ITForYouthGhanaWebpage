import { useState, useEffect } from 'react'

/**
 * Hook for responsive media queries
 * @param query - CSS media query string
 * @returns boolean indicating if media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    // Set initial value
    setMatches(mediaQuery.matches)

    // Create listener function
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Add listener
    mediaQuery.addEventListener('change', listener)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}

/**
 * Common breakpoint hooks for Tailwind responsive design
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(max-width: 1024px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)')
}
