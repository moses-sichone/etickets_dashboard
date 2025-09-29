import { getAuthHeader, refreshAccessToken, clearAuth } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface MerchantData {
  business_name: string
  contact_person: string
  contact_email: string
  contact_phone?: string
  tax_information?: string
  verification_state?: 'pending' | 'approved' | 'rejected' | 'suspended'
}

export interface MerchantResponse {
  id: number
  business_name: string
  contact_person: string
  contact_email: string
  contact_phone?: string
  tax_information?: string
  verification_state: 'pending' | 'approved' | 'rejected' | 'suspended'
  created_at: string
  updated_at: string
}

class MerchantAPI {
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

    console.log('MerchantAPI Request', {
      endpoint,
      method: options.method || 'GET',
      hasAuthHeader: !!authHeader.Authorization,
      authHeaderPreview: authHeader.Authorization ? `${authHeader.Authorization.substring(0, 30)}...` : null
    })

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    console.log('MerchantAPI Response', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      url: response.url
    })
    
    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      console.log('MerchantAPI: Received 401, attempting token refresh')
      
      // Try to refresh the token
      const newToken = await refreshAccessToken()
      if (newToken) {
        console.log('MerchantAPI: Token refreshed successfully, retrying request')
        // Retry the request with new token
        const newAuthHeader = getAuthHeader()
        const newConfig: RequestInit = {
          ...config,
          headers: {
            ...config.headers,
            ...newAuthHeader,
          },
        }
        
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, newConfig)
        if (retryResponse.ok) {
          const data = await retryResponse.json()
          console.log('MerchantAPI Success after retry', {
            endpoint,
            dataType: typeof data,
            dataKeys: Object.keys(data || {})
          })
          return data
        }
      }
      
      // If refresh failed or retry still failed, clear auth and redirect to login
      console.log('MerchantAPI: Token refresh failed, clearing auth and redirecting')
      clearAuth()
      window.location.href = '/login'
      throw new Error('Session expired. Please login again.')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('MerchantAPI Error', {
        endpoint,
        status: response.status,
        errorData
      })
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('MerchantAPI Success', {
      endpoint,
      dataType: typeof data,
      dataKeys: Object.keys(data || {})
    })

    return data
  }

  async createMerchant(merchantData: MerchantData): Promise<MerchantResponse> {
    return this.request('/api/merchants/', {
      method: 'POST',
      body: JSON.stringify(merchantData),
    })
  }

  async getMerchants(params?: {
    verification_state?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<MerchantResponse[]> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const endpoint = searchParams.toString() 
      ? `/api/merchants/?${searchParams.toString()}`
      : '/api/merchants/'

    return this.request(endpoint)
  }

  async getMerchant(id: number): Promise<MerchantResponse> {
    return this.request(`/api/merchants/${id}/`)
  }

  async updateMerchant(id: number, merchantData: Partial<MerchantData>): Promise<MerchantResponse> {
    return this.request(`/api/merchants/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(merchantData),
    })
  }

  async deleteMerchant(id: number): Promise<void> {
    return this.request(`/api/merchants/${id}/`, {
      method: 'DELETE',
    })
  }

  async getPendingMerchants(): Promise<MerchantResponse[]> {
    return this.request('/api/merchants/pending/')
  }

  async approveMerchant(id: number): Promise<MerchantResponse> {
    return this.request(`/api/merchants/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ verification_state: 'approved' }),
    })
  }

  async rejectMerchant(id: number, reason?: string): Promise<MerchantResponse> {
    return this.request(`/api/merchants/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        verification_state: 'rejected',
        rejection_reason: reason 
      }),
    })
  }
}

export const merchantAPI = new MerchantAPI()

// Export individual functions for easier usage
export const createMerchant = (data: MerchantData) => merchantAPI.createMerchant(data)
export const getMerchants = (params?: any) => merchantAPI.getMerchants(params)
export const getMerchant = (id: number) => merchantAPI.getMerchant(id)
export const updateMerchant = (id: number, data: Partial<MerchantData>) => merchantAPI.updateMerchant(id, data)
export const deleteMerchant = (id: number) => merchantAPI.deleteMerchant(id)
export const getPendingMerchants = () => merchantAPI.getPendingMerchants()
export const approveMerchant = (id: number) => merchantAPI.approveMerchant(id)
export const rejectMerchant = (id: number, reason?: string) => merchantAPI.rejectMerchant(id, reason)