'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { refreshAccessToken, clearAuth } from '@/lib/auth'

export interface AttendeeData {
  id: string
  name: string
  email: string
  phone: string
  event: string
  eventDate: string
  tickets: number
  totalAmount: string
  purchaseDate: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

interface UseAttendeesDataReturn {
  attendees: AttendeeData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAttendeesData(filters?: {
  status?: string
  event?: string
  page?: number
  page_size?: number
}): UseAttendeesDataReturn {
  const { user, getAccessToken } = useAuth()
  const [attendees, setAttendees] = useState<AttendeeData[]>([])
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
      if (filters?.event) queryParams.append('event', filters.event)
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.page_size) queryParams.append('page_size', filters.page_size.toString())

      const queryString = queryParams.toString()
      const url = `/api/attendees/${queryString ? `?${queryString}` : ''}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        console.log('AttendeesData: Received 401, attempting token refresh')
        
        // Try to refresh the token
        const newToken = await refreshAccessToken()
        if (newToken) {
          console.log('AttendeesData: Token refreshed successfully, retrying request')
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
            let attendeesData: AttendeeData[] = []
            if (Array.isArray(result)) {
              attendeesData = result
            } else if (result.data && Array.isArray(result.data)) {
              attendeesData = result.data
            } else if (result.results && Array.isArray(result.results)) {
              attendeesData = result.results
            } else if (result.success && result.data && Array.isArray(result.data)) {
              attendeesData = result.data
            }
            
            setAttendees(attendeesData)
            setLoading(false)
            return
          }
        }
        
        // If refresh failed or retry still failed, clear auth and redirect to login
        console.log('AttendeesData: Token refresh failed, clearing auth and redirecting')
        clearAuth()
        window.location.href = '/login'
        throw new Error('Session expired. Please login again.')
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendees data')
      }

      const result = await response.json()
      
      // Handle different response formats
      let attendeesData: AttendeeData[] = []
      if (Array.isArray(result)) {
        attendeesData = result
      } else if (result.data && Array.isArray(result.data)) {
        attendeesData = result.data
      } else if (result.results && Array.isArray(result.results)) {
        attendeesData = result.results
      } else if (result.success && result.data && Array.isArray(result.data)) {
        attendeesData = result.data
      }
      
      setAttendees(attendeesData)
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
    attendees,
    loading,
    error,
    refetch: fetchData
  }
}