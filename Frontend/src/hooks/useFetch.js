import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5500'

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(fullUrl, {
        timeout: 10000,
        ...options
      })

      setData(response.data)
      setError(null)
    } catch (err) {
      let errorMessage = 'Failed to fetch data'

      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`
      } else if (err.request) {
        errorMessage = 'Network error: Unable to reach server'
      } else {
        errorMessage = err.message || 'An unexpected error occurred'
      }

      setError(errorMessage)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [fullUrl])

  useEffect(() => {
    fetchData()

    return () => {
      // Cleanup function for component unmount
    }
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

export default useFetch