import React, { useState, useRef, useEffect } from 'react'
import { createBluePlaceholder } from '../../utils/imageValidation'

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
  placeholder?: string
  lazy?: boolean
  quality?: number
  sizes?: string
  blur?: boolean
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  lazy = true,
  quality = 75,
  blur = true,
  className = '',
  sizes,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? placeholder : src)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!lazy || !imageRef) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          observerRef.current?.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    observerRef.current.observe(imageRef)

    return () => observerRef.current?.disconnect()
  }, [imageRef, src, lazy])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true)
    if (fallbackSrc) {
      setImageSrc(fallbackSrc)
      return
    }
    
    // Create blue placeholder on error
    const target = event.target as HTMLImageElement
    const placeholderWidth = target.width || 400
    const placeholderHeight = target.height || 300
    target.src = createBluePlaceholder(placeholderWidth, placeholderHeight)
  }

  const imageClasses = [
    'transition-all duration-500 ease-out',
    isLoaded ? 'opacity-100' : 'opacity-0',
    blur && !isLoaded ? 'blur-sm' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="relative overflow-hidden">
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        className={imageClasses}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        {...props}
      />
      
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-neutral-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
      
    </div>
  )
}

export default OptimizedImage