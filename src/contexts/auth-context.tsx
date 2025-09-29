'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    console.log('AuthContext: Checking for saved user...');
    const savedUser = localStorage.getItem('etickets-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('AuthContext: Found saved user:', parsedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('AuthContext: Error parsing saved user from localStorage', e);
        localStorage.removeItem('etickets-user'); // Clear invalid data
      }
    } else {
      console.log('AuthContext: No saved user found.');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Frontend received data:', data); // Add this line for debugging

      if (response.ok && data.success) {
        const userFromResponse = data.data.user;
        const authenticatedUser: User = {
          id: userFromResponse?.id || 'unknown', // Fallback for id
          email: userFromResponse?.email || '', // Fallback for email
          name: userFromResponse?.username || '', // Fallback for name
          role: (userFromResponse?.role || 'UNKNOWN').toUpperCase() as 'ADMIN' | 'MERCHANT', // Fallback and type assertion
          accessToken: data.data.access || '', // Fallback for accessToken
          refreshToken: data.data.refresh || '', // Fallback for refreshToken
        };
        console.log('AuthContext: Authenticated user object:', authenticatedUser);
        setUser(authenticatedUser);
        localStorage.setItem('etickets-user', JSON.stringify(authenticatedUser));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const getAccessToken = (): string | null => {
    return user?.accessToken || null;
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem('etickets-user')
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