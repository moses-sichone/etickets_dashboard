'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { User, CreditCard, Shield, Bell, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export function SettingsSection() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const title = isAdmin ? 'Platform Settings' : 'Account Settings'

  const settingsSections = [
    {
      title: 'Profile Information',
      icon: User,
      status: 'Complete',
      color: 'text-green-600'
    },
    {
      title: isAdmin ? 'Commission Settings' : 'Payment Methods',
      icon: CreditCard,
      status: 'Configured',
      color: 'text-blue-600'
    },
    {
      title: 'Security',
      icon: Shield,
      status: 'Enabled',
      color: 'text-green-600'
    },
    {
      title: 'Notifications',
      icon: Bell,
      status: 'Active',
      color: 'text-green-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your preferences and account settings
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Save Changes
        </Button>
      </div>

      {/* Settings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {settingsSections.map((section, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{section.title}</p>
                <section.icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">{section.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Badge variant="outline">Last updated: Today</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  defaultValue={user?.name || (isAdmin ? 'John Doe' : 'Jane Smith')}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue={user?.email || (isAdmin ? 'admin@etickets.com' : 'merchant@etickets.com')}
                  readOnly
                  className="h-10 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="(GMT-05:00) Eastern Time">
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</SelectItem>
                    <SelectItem value="(GMT-06:00) Central Time">(GMT-06:00) Central Time</SelectItem>
                    <SelectItem value="(GMT-07:00) Mountain Time">(GMT-07:00) Mountain Time</SelectItem>
                    <SelectItem value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Admin Specific Settings */}
          {isAdmin && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Default Commission Rate (%)</Label>
                  <Input 
                    id="commissionRate" 
                    type="number"
                    defaultValue="10"
                    min="0"
                    max="100"
                    step="0.1"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minCommission">Minimum Commission ($)</Label>
                  <Input 
                    id="minCommission" 
                    type="number"
                    defaultValue="1"
                    min="0"
                    step="0.01"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Merchant Specific Settings */}
          {!isAdmin && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account</Label>
                  <Input 
                    id="bankAccount" 
                    defaultValue="**** **** **** 1234"
                    readOnly
                    className="h-10 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                  <Select defaultValue="Weekly">
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox id="emailNotif" defaultChecked />
                <Label htmlFor="emailNotif" className="text-sm font-medium">
                  Email Notifications
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="smsNotif" />
                <Label htmlFor="smsNotif" className="text-sm font-medium">
                  SMS Notifications
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="pushNotif" defaultChecked />
                <Label htmlFor="pushNotif" className="text-sm font-medium">
                  Push Notifications
                </Label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Change Password</p>
                  <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}