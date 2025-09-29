'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { saveAuthUser, getCurrentUser, clearAuth, getAccessToken } from '@/lib/auth'
import { debug, debugAuthStatus } from '@/lib/debug'

interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'MERCHANT'
  accessToken: string
  refreshToken: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    debug.info('AuthContext: Checking for saved user...')
    debugAuthStatus()
    
    const savedUser = getCurrentUser();
    if (savedUser) {
      debug.info('AuthContext: Found saved user:', savedUser);
      setUser(savedUser);
    } else {
      debug.info('AuthContext: No saved user found.');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      debug.info('AuthContext: Attempting login', { email })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      debug.info('AuthContext: Login response', { status: response.status, data })

      if (response.ok && data.success) {
        const userFromResponse = data.data.user;
        const authenticatedUser: User = {
          id: userFromResponse?.id || 'unknown',
          email: userFromResponse?.email || '',
          name: userFromResponse?.username || '',
          role: (userFromResponse?.role || 'UNKNOWN').toUpperCase() as 'ADMIN' | 'MERCHANT',
          accessToken: data.data.access || '',
          refreshToken: data.data.refresh || '',
        };
        
        debug.info('AuthContext: Authenticated user object:', authenticatedUser);
        setUser(authenticatedUser);
        saveAuthUser(authenticatedUser);
        debugAuthStatus() // Log after saving
        return true;
      } else {
        debug.error('AuthContext: Login failed', { data })
        return false;
      }
    } catch (error) {
      debug.error('AuthContext: Login error', error)
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const getAccessToken = (): string | null => {
    const token = user?.accessToken || getAccessToken();
    debug.info('AuthContext: getAccessToken called', { 
      hasUser: !!user, 
      hasTokenFromUser: !!user?.accessToken, 
      hasTokenFromStorage: !!getAccessToken(),
      tokenLength: token ? token.length : 0 
    })
    return token;
  };

  const logout = () => {
    debug.info('AuthContext: Logging out')
    setUser(null)
    clearAuth()
    debugAuthStatus()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}