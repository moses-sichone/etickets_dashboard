'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'MERCHANT'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('etickets-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo credentials
      if (email === 'admin@etickets.com' && password === 'password') {
        const adminUser: User = {
          id: '1',
          email: 'admin@etickets.com',
          name: 'John Doe',
          role: 'ADMIN'
        }
        setUser(adminUser)
        localStorage.setItem('etickets-user', JSON.stringify(adminUser))
        return true
      } else if (email === 'merchant@etickets.com' && password === 'password') {
        const merchantUser: User = {
          id: '2',
          email: 'merchant@etickets.com',
          name: 'Jane Smith',
          role: 'MERCHANT'
        }
        setUser(merchantUser)
        localStorage.setItem('etickets-user', JSON.stringify(merchantUser))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('etickets-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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