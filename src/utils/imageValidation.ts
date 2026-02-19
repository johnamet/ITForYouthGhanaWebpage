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
  // Handle base path correctly for production - Custom domain uses root path
  const basePath = ''
  const fullPath = path.startsWith('/') ? `${basePath}${path}` : `${basePath}/${path}`
  
  // Log image paths in development for debugging
  if (import.meta.env.DEV) {
    console.log(`Image path: ${fullPath}`)
  }
  
  return fullPath
}

// Create blue placeholder for missing images - optimized for smooth rendering
export const createBluePlaceholder = (width: number = 400, height: number = 300): string => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { alpha: false })
    
    if (!ctx) {
      // Fallback to solid color data URL if canvas fails
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%230c2d5a"/%3E%3C/svg%3E'
    }
    
    // Set canvas dimensions with proper pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    
    // Create blue gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#0c2d5a') // --color-primary
    gradient.addColorStop(1, '#1a3d6d') // --color-primary-light
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Add simple geometric shape in center for visual interest
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.2
    
    // Draw circles instead of rectangles for smoother appearance
    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, size * 1.3, 0, Math.PI * 2)
    ctx.stroke()
    
    return canvas.toDataURL('image/png', 0.9)
  } catch (error) {
    console.warn('Canvas rendering failed, using SVG fallback:', error)
    // Fallback SVG with gradient-like appearance
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="100" y2="100"%3E%3Cstop offset="0%25" stop-color="%230c2d5a"/%3E%3Cstop offset="100%25" stop-color="%231a3d6d"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g)"/%3E%3C/svg%3E'
  }
}

// Fallback image handler with proper error recovery
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement
  
  // Get original dimensions or use defaults
  const width = target.naturalWidth || target.width || target.offsetWidth || 400
  const height = target.naturalHeight || target.height || target.offsetHeight || 300
  
  console.warn(`Image failed to load: ${target.src}. Using blue placeholder.`)
  
  // Create and set blue placeholder
  target.src = createBluePlaceholder(Math.max(100, width), Math.max(100, height))
  target.style.objectFit = 'cover'
  target.style.objectPosition = 'center'
  // Prevent infinite error loops
  target.style.minHeight = '100px'
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
