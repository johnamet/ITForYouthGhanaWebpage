import React, { useState, useRef } from 'react'
import { getOptimizedImagePath, handleImageError } from '../utils/imageValidation'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  fallbackSrc?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style,
  fallbackSrc,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  const optimizedSrc = getOptimizedImagePath(src)
  const finalSrc = hasError && fallbackSrc 
    ? getOptimizedImagePath(fallbackSrc) 
    : optimizedSrc

  const handleImageLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleImageErrorEvent = (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`🖼️ Image failed to load: ${src}`)
    
    // If we have a fallback and haven't already tried it, use it
    if (fallbackSrc && !hasError) {
      setHasError(true)
      setIsLoading(false)
      onError?.()
      return // Let React re-render with fallback
    }
    
    // Otherwise use the error handler for placeholder
    setHasError(true)
    setIsLoading(false)
    onError?.()
    handleImageError(event)
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${className}`}
          style={style}
        />
      )}
      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt}
        className={className}
        style={{
          ...style,
          objectFit: style?.objectFit || 'cover',
          objectPosition: style?.objectPosition || 'center',
        }}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageErrorEvent}
        // Accessibility improvements
        decoding="async"
        crossOrigin="anonymous"
        // Performance hint
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      />
    </div>
  )
}

export default OptimizedImage
