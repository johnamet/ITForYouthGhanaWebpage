import { useState } from 'react'
import { enrollmentApi } from '../api'
import type { EnrollmentData, EnrollmentResponse } from '../types'

/**
 * Hook for managing course enrollment
 */
export function useEnrollment(courseId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const enroll = async (data: Omit<EnrollmentData, 'courseId'>) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await enrollmentApi.enroll({
      ...data,
      courseId,
    })

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      return result
    } else {
      setError(result.error || 'Enrollment failed')
      return result
    }
  }

  const withdraw = async (enrollmentId: string) => {
    setLoading(true)
    setError(null)

    const result = await enrollmentApi.withdraw(enrollmentId)

    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Withdrawal failed')
    }

    return result
  }

  return {
    enroll,
    withdraw,
    loading,
    error,
    success,
  }
}
