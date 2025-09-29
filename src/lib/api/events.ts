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
    const token = localStorage.getItem('access_token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
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