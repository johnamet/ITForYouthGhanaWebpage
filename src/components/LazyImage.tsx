// Performance-optimierte Komponente für Lazy Loading von Bildern
import React, { useState, useRef, useEffect } from 'react'
import { createBluePlaceholder } from '../utils/imageValidation'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
  bluePlaceholder?: boolean // Für Hero Sections
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af"%3ELoading...%3C/text%3E%3C/svg%3E',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  bluePlaceholder = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (priority) return // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px', // Extrem früheres Loading für besseres UX
        threshold: 0.01 // Sobald 1% sichtbar ist
      }
    )

    observerRef.current = observer

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true)
    if (onError) onError()
    
    // Set blue placeholder on error with proper fallback
    const target = event.target as HTMLImageElement
    const placeholderWidth = width || target.naturalWidth || target.width || 400
    const placeholderHeight = height || target.naturalHeight || target.height || 300
    target.src = createBluePlaceholder(Math.max(100, placeholderWidth), Math.max(100, placeholderHeight))
    target.style.objectFit = 'cover'
    target.style.objectPosition = 'center'
  }

  const imageProps = {
    alt,
    className: `transition-opacity duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    } ${className}`,
    onLoad: handleLoad,
    onError: handleError,
    ...(width && { width }),
    ...(height && { height })
  }

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        bluePlaceholder ? (
          <div className="absolute inset-0 bg-primary">
            <div className="absolute inset-0 bg-hero-overlay flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        ) : (
          <img
            src={placeholder}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${className}`}
            aria-hidden="true"
          />
        )
      )}


      {/* Actual Image - Optimiert für langsame Internetverbindungen */}
      {(isInView || priority) && (
        <img
          src={src}
          {...imageProps}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  )
}

export default LazyImage
