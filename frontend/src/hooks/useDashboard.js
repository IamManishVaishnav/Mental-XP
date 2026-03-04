import { useState, useEffect } from 'react'
import { getDashboard } from '../services/dashboardService'

export const useDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getDashboard()
      setData(res.data.dashboard)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { data, loading, error, refetch: fetch }
}