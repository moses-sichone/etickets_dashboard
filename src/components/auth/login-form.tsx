'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Ticket, CheckCircle } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = await login(email, password)
    if (!success) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 hidden lg:block">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-lg">
              <Ticket className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">ETickets</h1>
          </div>
          
          <h2 className="text-3xl font-semibold mb-4">Multi-Vendor Ticketing Platform</h2>
          <p className="text-lg opacity-90 mb-8">
            Professional event management with real-time analytics and secure payment processing
          </p>
          
          <div className="space-y-4">
            {[
              { icon: CheckCircle, text: 'Streamlined Event Management' },
              { icon: CheckCircle, text: 'Real-time Sales Analytics' },
              { icon: CheckCircle, text: 'Secure Payment Processing' },
              { icon: CheckCircle, text: 'Multi-Vendor Marketplace' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-yellow-300" />
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Ticket className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-indigo-100">
                Sign in to your account to continue
              </p>
            </div>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 text-base border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 text-base border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Forgot your password?{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Reset it here
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}