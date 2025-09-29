'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { saveAuthUser, getCurrentUser, clearAuth, getAccessToken as getStoredAccessToken } from '@/lib/auth'

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
    console.log('AuthContext: Checking for saved user...')
    
    const savedUser = getCurrentUser();
    if (savedUser) {
      console.log('AuthContext: Found saved user:', savedUser);
      setUser(savedUser);
    } else {
      console.log('AuthContext: No saved user found.');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      console.log('AuthContext: Attempting login', { email })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('AuthContext: Login response', { status: response.status, data })

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
        
        console.log('AuthContext: Authenticated user object:', authenticatedUser);
        setUser(authenticatedUser);
        saveAuthUser(authenticatedUser);
        return true;
      } else {
        console.error('AuthContext: Login failed', { data })
        return false;
      }
    } catch (error) {
      console.error('AuthContext: Login error', error)
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const getAccessToken = (): string | null => {
    const token = user?.accessToken || getStoredAccessToken();
    console.log('AuthContext: getAccessToken called', { 
      hasUser: !!user, 
      hasTokenFromUser: !!user?.accessToken, 
      hasTokenFromStorage: !!getStoredAccessToken(),
      tokenLength: token ? token.length : 0 
    })
    return token;
  };

  const logout = () => {
    console.log('AuthContext: Logging out')
    setUser(null)
    clearAuth()
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