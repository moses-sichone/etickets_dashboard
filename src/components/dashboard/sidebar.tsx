'use client'

import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Ticket, Home, Calendar, Users, Store, ChartBar, DollarSign, Settings, MapPin, Search, Bell } from 'lucide-react'

interface SidebarProps {
  onNavigate: (section: string) => void
  activeSection: string
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

export function Sidebar({ onNavigate, activeSection }: SidebarProps) {
  const { user } = useAuth()

  const adminMenu: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '#dashboard' },
    { id: 'events', label: 'Events', icon: Calendar, href: '#events' },
    { id: 'tickets', label: 'Tickets', icon: Ticket, href: '#tickets' },
    { id: 'attendees', label: 'Attendees', icon: Users, href: '#attendees' },
    { id: 'merchants', label: 'Merchants', icon: Store, href: '#merchants' },
    { id: 'analytics', label: 'Analytics', icon: ChartBar, href: '#analytics' },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, href: '#revenue' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '#settings' }
  ]

  const merchantMenu: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '#dashboard' },
    { id: 'events', label: 'My Events', icon: Calendar, href: '#my-events' },
    { id: 'tickets', label: 'My Tickets', icon: Ticket, href: '#my-tickets' },
    { id: 'venues', label: 'My Venues', icon: MapPin, href: '#my-venues' },
    { id: 'analytics', label: 'My Analytics', icon: ChartBar, href: '#my-analytics' },
    { id: 'revenue', label: 'My Revenue', icon: DollarSign, href: '#my-revenue' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '#settings' }
  ]

  const menuItems = user?.role === 'ADMIN' ? adminMenu : merchantMenu

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo and Role */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg">
              <Ticket className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ETickets</span>
          </div>
        </div>
        <Badge 
          variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}
          className={cn(
            "text-xs font-medium",
            user?.role === 'ADMIN' 
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" 
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          )}
        >
          {user?.role === 'ADMIN' ? 'Administrator' : 'Merchant'}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800",
                  "group",
                  activeSection === item.id && "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300",
                  activeSection === item.id && "text-indigo-600 dark:text-indigo-400"
                )} />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-sm">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {user?.name}
          </p>
          <p className="text-gray-600 dark:text-gray-400 truncate">
            {user?.email}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Last login: Today
          </div>
        </div>
      </div>
    </div>
  )
}