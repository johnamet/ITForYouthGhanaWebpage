/**
 * Environment configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const ENVIRONMENT = import.meta.env.MODE || 'development'
export const IS_DEV = ENVIRONMENT === 'development'
export const IS_PROD = ENVIRONMENT === 'production'

/**
 * Feature flags
 */
export const FEATURES = {
  ENABLE_DONATIONS: true,
  ENABLE_ENROLLMENT: true,
  ENABLE_VOLUNTEER_REGISTRATION: true,
}

/**
 * App metadata
 */
export const APP_NAME = 'IT For Youth Ghana'
export const APP_DESCRIPTION = 'Empowering African youth with IT skills and opportunities'
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://itforyouthghana.org'
