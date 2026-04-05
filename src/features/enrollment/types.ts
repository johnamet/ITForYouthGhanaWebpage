/**
 * Enrollment feature types
 */

export interface EnrollmentData {
  courseId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  educationLevel?: string
  experience?: string
  motivations?: string
}

export interface EnrollmentResponse {
  success: boolean
  enrollmentId?: string
  message?: string
  error?: string
}

export interface EnrollmentStatus {
  isEnrolled: boolean
  enrollmentId?: string
  enrolledAt?: string
}
