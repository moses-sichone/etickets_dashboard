'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { refreshAccessToken, clearAuth } from '@/lib/auth'

export interface AnalyticsMetricsData {
  total_users: number
  active_users: number
  total_events: number
  active_events: number
  total_tickets_sold: number
  total_revenue: number
  conversion_rate: number
  monthly_growth: number
}

export interface AnalyticsPerformanceData {
  revenue_by_period: Array<{
    period: string
    revenue: number
    tickets_sold: number
  }>
  user_activity: Array<{
    period: string
    active_users: number
    new_users: number
  }>
  event_performance: Array<{
    event_id: string
    event_name: string
    revenue: number
    tickets_sold: number
  }>
}

export interface AnalyticsTopEventsData {
  events: Array<{
    id: string
    name: string
    revenue: number
    tickets_sold: number
    category: string
  }>
}

export interface AnalyticsTrendsData {
  revenue_trend: Array<{
    period: string
    revenue: number
    growth_rate: number
  }>
  user_trend: Array<{
    period: string
    users: number
    growth_rate: number
  }>
  ticket_trend: Array<{
    period: string
    tickets_sold: number
    growth_rate: number
  }>
}

interface UseAnalyticsDataReturn {
  metrics: AnalyticsMetricsData | null
  performance: AnalyticsPerformanceData | null
  topEvents: AnalyticsTopEventsData | null
  trends: AnalyticsTrendsData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAnalyticsData(period: string = 'month', merchantId?: string): UseAnalyticsDataReturn {
  const { user, getAccessToken } = useAuth()
  const [metrics, setMetrics] = useState<AnalyticsMetricsData | null>(null)
  const [performance, setPerformance] = useState<AnalyticsPerformanceData | null>(null)
  const [topEvents, setTopEvents] = useState<AnalyticsTopEventsData | null>(null)
  const [trends, setTrends] = useState<AnalyticsTrendsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('Authentication token not found.');
      }

      const handleResponse = async (response: Response, endpoint: string) => {
        if (response.status === 401) {
          console.log(`AnalyticsData: Received 401 from ${endpoint}, attempting token refresh`)
          
          // Try to refresh the token
          const newToken = await refreshAccessToken()
          if (newToken) {
            console.log(`AnalyticsData: Token refreshed successfully, retrying ${endpoint}`)
            // Retry the request with new token
            const retryResponse = await fetch(endpoint, {
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json',
              },
            })
            
            if (retryResponse.ok) {
              return await retryResponse.json()
            }
          }
          
          // If refresh failed or retry still failed, clear auth and redirect to login
          console.log(`AnalyticsData: Token refresh failed for ${endpoint}, clearing auth and redirecting`)
          clearAuth()
          window.location.href = '/login'
          throw new Error('Session expired. Please login again.')
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${endpoint}`)
        }
        
        return await response.json()
      }

      // Fetch metrics
      const metricsEndpoint = `/api/analytics/metrics/?period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`
      const metricsResponse = await fetch(metricsEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (metricsResponse.ok) {
        const metricsResult = await handleResponse(metricsResponse, metricsEndpoint)
        setMetrics(metricsResult.data || metricsResult)
      }

      // Fetch performance
      const performanceEndpoint = `/api/analytics/performance/?period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`
      const performanceResponse = await fetch(performanceEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (performanceResponse.ok) {
        const performanceResult = await handleResponse(performanceResponse, performanceEndpoint)
        setPerformance(performanceResult.data || performanceResult)
      }

      // Fetch top events
      const topEventsEndpoint = `/api/analytics/top-events/?limit=10&period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`
      const topEventsResponse = await fetch(topEventsEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (topEventsResponse.ok) {
        const topEventsResult = await handleResponse(topEventsResponse, topEventsEndpoint)
        setTopEvents(topEventsResult.data || topEventsResult)
      }

      // Fetch trends
      const trendsEndpoint = `/api/analytics/trends/?period=${period}&metric=revenue${merchantId ? `&merchant_id=${merchantId}` : ''}`
      const trendsResponse = await fetch(trendsEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (trendsResponse.ok) {
        const trendsResult = await handleResponse(trendsResponse, trendsEndpoint)
        setTrends(trendsResult.data || trendsResult)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, period, merchantId])

  return {
    metrics,
    performance,
    topEvents,
    trends,
    loading,
    error,
    refetch: fetchData
  }
}