'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { refreshAccessToken, clearAuth } from '@/lib/auth'

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
  const { user, getAccessToken } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const endpoint = user.role === 'ADMIN' 
        ? '/api/dashboard/admin/' 
        : '/api/dashboard/merchant/'

      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('Authentication token not found.');
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        console.log('DashboardData: Received 401, attempting token refresh')
        
        // Try to refresh the token
        const newToken = await refreshAccessToken()
        if (newToken) {
          console.log('DashboardData: Token refreshed successfully, retrying request')
          // Retry the request with new token
          const retryResponse = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          })
          
          if (retryResponse.ok) {
            const result = await retryResponse.json()
            if (result.success) {
              setData(result.data)
              setLoading(false)
              return
            }
          }
        }
        
        // If refresh failed or retry still failed, clear auth and redirect to login
        console.log('DashboardData: Token refresh failed, clearing auth and redirecting')
        clearAuth()
        window.location.href = '/login'
        throw new Error('Session expired. Please login again.')
      }
      
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