/**
 * Enrollment API calls
 */

import type { EnrollmentData, EnrollmentResponse, EnrollmentStatus } from './types'

export const enrollmentApi = {
  /**
   * Submit course enrollment
   */
  enroll: async (data: EnrollmentData): Promise<EnrollmentResponse> => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Enrollment failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },

  /**
   * Check if user is enrolled in a course
   */
  checkEnrollment: async (courseId: string, email: string): Promise<EnrollmentStatus> => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/enrollments/status?courseId=${courseId}&email=${email}`)

      if (!response.ok) {
        return { isEnrolled: false }
      }

      return await response.json()
    } catch {
      return { isEnrolled: false }
    }
  },

  /**
   * Withdraw from course
   */
  withdraw: async (enrollmentId: string): Promise<EnrollmentResponse> => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Withdrawal failed')
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },
}
