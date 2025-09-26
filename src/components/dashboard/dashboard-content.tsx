'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'
import { AdminDashboard } from './admin-dashboard'
import { MerchantDashboard } from './merchant-dashboard'
import { EventsSection } from './sections/events-section'
import { TicketsSection } from './sections/tickets-section'
import { AttendeesSection } from './sections/attendees-section'
import { MerchantsSection } from './sections/merchants-section'
import { VenuesSection } from './sections/venues-section'
import { AnalyticsSection } from './sections/analytics-section'
import { RevenueSection } from './sections/revenue-section'
import { SettingsSection } from './sections/settings-section'
import { Menu, Ticket, LogOut, Search, Bell } from 'lucide-react'

type ActiveSection = 'dashboard' | 'events' | 'tickets' | 'attendees' | 'merchants' | 'venues' | 'analytics' | 'revenue' | 'settings'

interface NavItem {
  id: ActiveSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
  merchantOnly?: boolean
}

export function DashboardContent() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard')
  const isAdmin = user?.role === 'ADMIN'

  const navigationItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Menu },
    { id: 'events', label: 'Events', icon: Ticket },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'attendees', label: 'Attendees', icon: Ticket, adminOnly: true },
    { id: 'merchants', label: 'Merchants', icon: Ticket, adminOnly: true },
    { id: 'venues', label: 'Venues', icon: Ticket, merchantOnly: true },
    { id: 'analytics', label: 'Analytics', icon: Ticket },
    { id: 'revenue', label: 'Revenue', icon: Ticket },
    { id: 'settings', label: 'Settings', icon: Ticket }
  ]

  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false
    if (item.merchantOnly && isAdmin) return false
    return true
  })

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <MerchantDashboard />
      case 'events':
        return <EventsSection />
      case 'tickets':
        return <TicketsSection />
      case 'attendees':
        return <AttendeesSection />
      case 'merchants':
        return <MerchantsSection />
      case 'venues':
        return <VenuesSection />
      case 'analytics':
        return <AnalyticsSection />
      case 'revenue':
        return <RevenueSection />
      case 'settings':
        return <SettingsSection />
      default:
        return isAdmin ? <AdminDashboard /> : <MerchantDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Desktop Sidebar - Fixed Position */}
      <div className="hidden lg:block w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 h-full z-20">
        <Sidebar onNavigate={setActiveSection} activeSection={activeSection} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">ETickets</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <Sidebar onNavigate={setActiveSection} activeSection={activeSection} />
                </SheetContent>
              </Sheet>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
              <div className="flex-1 flex items-center space-x-4">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events, tickets, or attendees..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">{user?.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderActiveSection()}
          </div>
      </div>
    </div>
  )
}