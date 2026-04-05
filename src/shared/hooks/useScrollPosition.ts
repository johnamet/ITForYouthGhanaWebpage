import { useState, useEffect } from 'react'

/**
 * Hook to track scroll position
 * @returns Current scroll position (y-axis)
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', updatePosition)
    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}

/**
 * Hook to detect if page is scrolled past a certain threshold
 * @param threshold - Pixel threshold
 * @returns boolean indicating if page is scrolled past threshold
 */
export function useIsScrolledPast(threshold: number = 100): boolean {
  const scrollPosition = useScrollPosition()
  return scrollPosition > threshold
}
