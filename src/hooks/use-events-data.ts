'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { refreshAccessToken, clearAuth } from '@/lib/auth'

export interface EventData {
  id: string
  name: string
  date: string
  venue: string
  merchant: string
  ticketsSold: number
  totalTickets: number
  revenue: string
  status: 'active' | 'pending' | 'completed' | 'cancelled'
  category: string
}

interface UseEventsDataReturn {
  events: EventData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useEventsData(filters?: {
  status?: string
  category?: string
  startDate?: string
  endDate?: string
}): UseEventsDataReturn {
  const { user, getAccessToken } = useAuth()
  const [events, setEvents] = useState<EventData[]>([])
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

      // Build query parameters
      const queryParams = new URLSearchParams()
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.startDate) queryParams.append('startDate', filters.startDate)
      if (filters?.endDate) queryParams.append('endDate', filters.endDate)

      const queryString = queryParams.toString()
      const url = `/api/events/${queryString ? `?${queryString}` : ''}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        console.log('EventsData: Received 401, attempting token refresh')
        
        // Try to refresh the token
        const newToken = await refreshAccessToken()
        if (newToken) {
          console.log('EventsData: Token refreshed successfully, retrying request')
          // Retry the request with new token
          const retryResponse = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          })
          
          if (retryResponse.ok) {
            const result = await retryResponse.json()
            
            // Handle different response formats
            let eventsData: EventData[] = []
            if (Array.isArray(result)) {
              eventsData = result
            } else if (result.data && Array.isArray(result.data)) {
              eventsData = result.data
            } else if (result.results && Array.isArray(result.results)) {
              eventsData = result.results
            } else if (result.success && result.data && Array.isArray(result.data)) {
              eventsData = result.data
            }
            
            setEvents(eventsData)
            setLoading(false)
            return
          }
        }
        
        // If refresh failed or retry still failed, clear auth and redirect to login
        console.log('EventsData: Token refresh failed, clearing auth and redirecting')
        clearAuth()
        window.location.href = '/login'
        throw new Error('Session expired. Please login again.')
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch events data')
      }

      const result = await response.json()
      
      // Handle different response formats
      let eventsData: EventData[] = []
      if (Array.isArray(result)) {
        eventsData = result
      } else if (result.data && Array.isArray(result.data)) {
        eventsData = result.data
      } else if (result.results && Array.isArray(result.results)) {
        eventsData = result.results
      } else if (result.success && result.data && Array.isArray(result.data)) {
        eventsData = result.data
      }
      
      setEvents(eventsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, JSON.stringify(filters)])

  return {
    events,
    loading,
    error,
    refetch: fetchData
  }
}