'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export interface RevenueData {
  total_revenue: number
  monthly_revenue: number
  platform_fees: number
  merchant_payouts: number
  pending_payouts: number
}

export interface RevenueDistributionData {
  by_category: Array<{
    category: string
    revenue: number
    percentage: number
  }>
  by_merchant: Array<{
    merchant_id: string
    merchant_name: string
    revenue: number
    percentage: number
  }>
  by_period: Array<{
    period: string
    revenue: number
    percentage: number
  }>
}

export interface RevenuePayoutsData {
  payouts: Array<{
    id: string
    merchant_id: string
    merchant_name: string
    amount: number
    status: 'pending' | 'processed' | 'failed'
    created_at: string
    processed_at?: string
  }>
  total: number
  page: number
  page_size: number
}

export interface RevenueTrendsData {
  revenue_trend: Array<{
    period: string
    revenue: number
    growth_rate: number
  }>
  comparison: {
    current_period: number
    previous_period: number
    growth_rate: number
  }
}

interface UseRevenueDataReturn {
  revenue: RevenueData | null
  distribution: RevenueDistributionData | null
  payouts: RevenuePayoutsData | null
  trends: RevenueTrendsData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useRevenueData(period: string = 'month', merchantId?: string): UseRevenueDataReturn {
  const { user, getAccessToken } = useAuth()
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [distribution, setDistribution] = useState<RevenueDistributionData | null>(null)
  const [payouts, setPayouts] = useState<RevenuePayoutsData | null>(null)
  const [trends, setTrends] = useState<RevenueTrendsData | null>(null)
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

      // Fetch revenue data
      const revenueResponse = await fetch(`/api/revenue?period=${period}${merchantId ? `&merchantId=${merchantId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (revenueResponse.ok) {
        const revenueResult = await revenueResponse.json()
        setRevenue(revenueResult.data || revenueResult)
      }

      // Fetch distribution data
      const distributionResponse = await fetch(`/api/revenue/distribution?period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (distributionResponse.ok) {
        const distributionResult = await distributionResponse.json()
        setDistribution(distributionResult.data || distributionResult)
      }

      // Fetch payouts data
      const payoutsResponse = await fetch(`/api/revenue/payouts?${merchantId ? `merchant_id=${merchantId}&` : ''}page=1&page_size=20`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (payoutsResponse.ok) {
        const payoutsResult = await payoutsResponse.json()
        setPayouts(payoutsResult.data || payoutsResult)
      }

      // Fetch trends data
      const trendsResponse = await fetch(`/api/revenue/trends?period=${period}${merchantId ? `&merchant_id=${merchantId}` : ''}`, {
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
    revenue,
    distribution,
    payouts,
    trends,
    loading,
    error,
    refetch: fetchData
  }
}