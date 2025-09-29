'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

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

      // Fetch metrics
      const metricsResponse = await fetch(`/api/analytics/metrics?period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (metricsResponse.ok) {
        const metricsResult = await metricsResponse.json()
        setMetrics(metricsResult.data || metricsResult)
      }

      // Fetch performance
      const performanceResponse = await fetch(`/api/analytics/performance?period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (performanceResponse.ok) {
        const performanceResult = await performanceResponse.json()
        setPerformance(performanceResult.data || performanceResult)
      }

      // Fetch top events
      const topEventsResponse = await fetch(`/api/analytics/top-events?limit=10&period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (topEventsResponse.ok) {
        const topEventsResult = await topEventsResponse.json()
        setTopEvents(topEventsResult.data || topEventsResult)
      }

      // Fetch trends
      const trendsResponse = await fetch(`/api/analytics/trends?period=${period}&metric=revenue${merchantId ? `&merchant_id=${merchantId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (trendsResponse.ok) {
        const trendsResult = await trendsResponse.json()
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