/**
 * Authentication utilities for handling JWT tokens
 */

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'MERCHANT'
  accessToken: string
  refreshToken: string
}

/**
 * Get the current access token from localStorage
 */
export function getAccessToken(): string | null {
  try {
    const savedUser = localStorage.getItem('etickets-user')
    if (!savedUser) return null
    
    const user: AuthUser = JSON.parse(savedUser)
    return user.accessToken || null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

/**
 * Get the current refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  try {
    const savedUser = localStorage.getItem('etickets-user')
    if (!savedUser) return null
    
    const user: AuthUser = JSON.parse(savedUser)
    return user.refreshToken || null
  } catch (error) {
    console.error('Error getting refresh token:', error)
    return null
  }
}

/**
 * Get the current user from localStorage
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const savedUser = localStorage.getItem('etickets-user')
    if (!savedUser) return null
    
    const user: AuthUser = JSON.parse(savedUser)
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Save user authentication data to localStorage
 */
export function saveAuthUser(user: AuthUser): void {
  try {
    localStorage.setItem('etickets-user', JSON.stringify(user))
  } catch (error) {
    console.error('Error saving auth user:', error)
  }
}

/**
 * Remove user authentication data from localStorage
 */
export function clearAuth(): void {
  try {
    localStorage.removeItem('etickets-user')
  } catch (error) {
    console.error('Error clearing auth:', error)
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): { Authorization?: string } {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Refresh the access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    const newAccessToken = data.access

    // Update the user object with new access token
    const currentUser = getCurrentUser()
    if (currentUser) {
      currentUser.accessToken = newAccessToken
      saveAuthUser(currentUser)
    }

    return newAccessToken
  } catch (error) {
    console.error('Error refreshing access token:', error)
    clearAuth()
    return null
  }
}