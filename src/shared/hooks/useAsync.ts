import { useState, useEffect } from 'react'

interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error'
  data?: T
  error?: Error
}

/**
 * Hook for managing async operations
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately (default: true)
 * @returns Object with status, data, error, and execute function
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): AsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
  })

  const execute = async () => {
    setState({ status: 'pending' })
    try {
      const response = await asyncFunction()
      setState({ status: 'success', data: response })
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error : new Error('Unknown error'),
      })
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate])

  return { ...state, execute }
}
