'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getMerchants, MerchantResponse } from '@/lib/api/merchants'

export interface MerchantDisplayData {
  id: string
  name: string
  businessType: string
  events: number
  ticketsSold: number
  revenue: string
  commission: string
  status: 'active' | 'pending' | 'suspended' | 'rejected'
  contactPerson: string
  contactEmail: string
  createdAt: string
}

interface UseMerchantsDataReturn {
  merchants: MerchantDisplayData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// Function to transform API response to display format
const transformMerchantData = (merchant: MerchantResponse): MerchantDisplayData => {
  // Map verification_state to status
  const statusMap = {
    'approved': 'active' as const,
    'pending': 'pending' as const,
    'suspended': 'suspended' as const,
    'rejected': 'rejected' as const
  }

  return {
    id: merchant.id.toString(),
    name: merchant.business_name,
    businessType: 'Business', // Default value since API doesn't provide business type
    events: 0, // Default value - would need to calculate from events data
    ticketsSold: 0, // Default value - would need to calculate from tickets data
    revenue: '$0', // Default value - would need to calculate from orders data
    commission: '$0', // Default value - would need to calculate from revenue data
    status: statusMap[merchant.verification_state] || 'pending',
    contactPerson: merchant.contact_person,
    contactEmail: merchant.contact_email,
    createdAt: merchant.created_at
  }
}

export function useMerchantsData(filters?: {
  verification_state?: string
  search?: string
  limit?: number
  offset?: number
}): UseMerchantsDataReturn {
  const { user, getAccessToken } = useAuth()
  const [merchants, setMerchants] = useState<MerchantDisplayData[]>([])
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

      console.log('Fetching merchants with filters:', filters)
      const result = await getMerchants(filters)
      console.log('Merchants API response:', result)
      
      // Handle different response formats
      let merchantsData: MerchantResponse[] = []
      if (Array.isArray(result)) {
        merchantsData = result
      } else if (result.data && Array.isArray(result.data)) {
        merchantsData = result.data
      } else if (result.results && Array.isArray(result.results)) {
        merchantsData = result.results
      } else if (result.success && result.data && Array.isArray(result.data)) {
        merchantsData = result.data
      }
      
      console.log('Processed merchants data:', merchantsData)
      const transformedData = merchantsData.map(transformMerchantData)
      console.log('Transformed display data:', transformedData)
      
      setMerchants(transformedData)
    } catch (err) {
      console.error('Error fetching merchants:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, JSON.stringify(filters)])

  return {
    merchants,
    loading,
    error,
    refetch: fetchData
  }
}