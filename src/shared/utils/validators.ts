/**
 * Common validation utilities
 */

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong'
  feedback: string[]
} {
  const feedback: string[] = []
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number')
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Password must contain at least one special character')
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (feedback.length === 0) {
    strength = 'strong'
  } else if (feedback.length <= 2) {
    strength = 'medium'
  }
  
  return {
    isValid: feedback.length === 0,
    strength,
    feedback,
  }
}

/**
 * Validate required field
 */
export function isRequired(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value != null
}

/**
 * Validate min length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

/**
 * Validate max length
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}
