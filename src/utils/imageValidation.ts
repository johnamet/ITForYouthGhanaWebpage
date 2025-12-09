// Professional image validation and error handling utilities

export const validateImageExists = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

export const getOptimizedImagePath = (path: string): string => {
  // Handle base path correctly for production
  const basePath = import.meta.env.DEV ? '' : '/Webpage'
  const fullPath = path.startsWith('/') ? `${basePath}${path}` : `${basePath}/${path}`
  
  // Log image paths in development for debugging
  if (import.meta.env.DEV) {
    console.log(`Image path: ${fullPath}`)
  }
  
  return fullPath
}

// Create blue placeholder for missing images
export const createBluePlaceholder = (width: number = 400, height: number = 300): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  canvas.width = width
  canvas.height = height
  
  // Create blue gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#0c2d5a') // --color-primary
  gradient.addColorStop(1, '#1a3d6d') // --color-primary-light
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Add icon in center
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '48px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🖼️', width / 2, height / 2)
  
  return canvas.toDataURL()
}

// Fallback image handler
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement
  
  // Get original dimensions or use defaults
  const width = target.naturalWidth || target.width || 400
  const height = target.naturalHeight || target.height || 300
  
  console.warn(`Image failed to load: ${target.src}. Using blue placeholder.`)
  
  // Create and set blue placeholder
  target.src = createBluePlaceholder(width, height)
  target.style.objectFit = 'cover'
}

// Image preloader for critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    img.src = src
  })
}

// Batch image preloader
export const preloadImages = async (imagePaths: string[]): Promise<void> => {
  try {
    await Promise.all(imagePaths.map(preloadImage))
    console.log('✅ All critical images preloaded successfully')
  } catch (error) {
    console.error('❌ Failed to preload some images:', error)
  }
}