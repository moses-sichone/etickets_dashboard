'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface DashboardData {
  stats: Record<string, any>
  recentActivity?: any[]
  systemAlerts?: any[]
  recentEvents?: any[]
  upcomingEvents?: any[]
  recentSales?: any[]
}

interface UseDashboardDataReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardData(): UseDashboardDataReturn {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const endpoint = user.role === 'ADMIN' 
        ? '/api/dashboard/admin' 
        : '/api/dashboard/merchant'

      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}