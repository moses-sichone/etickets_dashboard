import { getAuthHeader } from '@/lib/auth'
import { debug } from '@/lib/debug'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface EventData {
  title: string
  description?: string
  category: string
  date: string
  time?: string
  venue: string
  address?: string
  capacity?: number
  price: number
  image_url?: string
}

export interface EventResponse {
  id: number
  title: string
  description?: string
  category: string
  date: string
  time?: string
  venue: string
  address?: string
  capacity?: number
  price: number
  image_url?: string
  created_at: string
  updated_at: string
  status: 'draft' | 'published' | 'cancelled'
}

class EventAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const authHeader = getAuthHeader()
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
      },
      ...options,
    }

    debug.info('EventAPI Request', {
      endpoint,
      method: options.method || 'GET',
      hasAuthHeader: !!authHeader.Authorization,
      authHeaderPreview: authHeader.Authorization ? `${authHeader.Authorization.substring(0, 30)}...` : null
    })

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    debug.info('EventAPI Response', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      url: response.url
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      debug.error('EventAPI Error', {
        endpoint,
        status: response.status,
        errorData
      })
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    debug.info('EventAPI Success', {
      endpoint,
      dataType: typeof data,
      dataKeys: Object.keys(data || {})
    })

    return data
  }

  async createEvent(eventData: EventData): Promise<EventResponse> {
    return this.request('/api/events/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
  }

  async getEvents(params?: {
    category?: string
    status?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<EventResponse[]> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const endpoint = searchParams.toString() 
      ? `/api/events/?${searchParams.toString()}`
      : '/api/events/'

    return this.request(endpoint)
  }

  async getEvent(id: number): Promise<EventResponse> {
    return this.request(`/api/events/${id}/`)
  }

  async updateEvent(id: number, eventData: Partial<EventData>): Promise<EventResponse> {
    return this.request(`/api/events/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    })
  }

  async deleteEvent(id: number): Promise<void> {
    return this.request(`/api/events/${id}/`, {
      method: 'DELETE',
    })
  }
}

export const eventAPI = new EventAPI()

// Export individual functions for easier usage
export const createEvent = (data: EventData) => eventAPI.createEvent(data)
export const getEvents = (params?: any) => eventAPI.getEvents(params)
export const getEvent = (id: number) => eventAPI.getEvent(id)
export const updateEvent = (id: number, data: Partial<EventData>) => eventAPI.updateEvent(id, data)
export const deleteEvent = (id: number) => eventAPI.deleteEvent(id)