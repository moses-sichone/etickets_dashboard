/**
 * Debug utilities for authentication and API issues
 */

export class DebugLogger {
  private static instance: DebugLogger
  private logs: Array<{ timestamp: Date; level: string; message: string; data?: any }> = []

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger()
    }
    return DebugLogger.instance
  }

  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      data
    }
    
    this.logs.push(logEntry)
    console.log(`[${level.toUpperCase()}] ${message}`, data || '')
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100)
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, data?: any) {
    this.log('error', message, data)
  }

  getLogs() {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const debug = DebugLogger.getInstance()

/**
 * Check authentication status and log details
 */
export function debugAuthStatus() {
  const token = localStorage.getItem('etickets-user')
  debug.info('Auth Status Check', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenPreview: token ? `${token.substring(0, 50)}...` : null,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  })

  if (token) {
    try {
      const parsed = JSON.parse(token)
      debug.info('Parsed Token Data', {
        id: parsed.id,
        email: parsed.email,
        role: parsed.role,
        hasAccessToken: !!parsed.accessToken,
        accessTokenLength: parsed.accessToken ? parsed.accessToken.length : 0,
        hasRefreshToken: !!parsed.refreshToken,
        refreshTokenLength: parsed.refreshToken ? parsed.refreshToken.length : 0
      })
    } catch (e) {
      debug.error('Failed to parse token', { error: e })
    }
  }
}

/**
 * Test API call with detailed logging
 */
export async function debugApiCall(endpoint: string, options: RequestInit = {}) {
  debug.info('Making API Call', {
    endpoint,
    method: options.method || 'GET',
    headers: options.headers,
    hasBody: !!options.body
  })

  try {
    const response = await fetch(endpoint, options)
    
    debug.info('API Response', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    })

    const responseText = await response.text()
    
    try {
      const responseJson = JSON.parse(responseText)
      debug.info('API Response Body', responseJson)
      return { response, data: responseJson }
    } catch (e) {
      debug.info('API Response (non-JSON)', { text: responseText.substring(0, 500) })
      return { response, data: responseText }
    }
  } catch (error) {
    debug.error('API Call Failed', { error })
    throw error
  }
}