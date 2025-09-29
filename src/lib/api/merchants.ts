import { getAuthHeader } from '@/lib/auth'
import { debug } from '@/lib/debug'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface MerchantData {
  business_name: string
  business_type: string
  description?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  address?: string
  city?: string
  country?: string
  website?: string
  tax_id?: string
  business_license?: string
  status?: 'pending' | 'approved' | 'rejected' | 'suspended'
}

export interface MerchantResponse {
  id: number
  business_name: string
  business_type: string
  description?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  address?: string
  city?: string
  country?: string
  website?: string
  tax_id?: string
  business_license?: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
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

    debug.info('MerchantAPI Request', {
      endpoint,
      method: options.method || 'GET',
      hasAuthHeader: !!authHeader.Authorization,
      authHeaderPreview: authHeader.Authorization ? `${authHeader.Authorization.substring(0, 30)}...` : null
    })

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    debug.info('MerchantAPI Response', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      url: response.url
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      debug.error('MerchantAPI Error', {
        endpoint,
        status: response.status,
        errorData
      })
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    debug.info('MerchantAPI Success', {
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
    status?: string
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
      body: JSON.stringify({ status: 'approved' }),
    })
  }

  async rejectMerchant(id: number, reason?: string): Promise<MerchantResponse> {
    return this.request(`/api/merchants/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        status: 'rejected',
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