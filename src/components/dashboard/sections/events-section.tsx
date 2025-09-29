'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, MapPin, Users, Ticket, Plus, Eye, Edit, Trash2, Filter, Download } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEventsData } from '@/hooks/use-events-data'
import { LoadingSpinner } from '../loading-spinner'
import { ErrorDisplay } from '../error-display'
import { useState } from 'react'

interface EventData {
  id: string
  name: string
  date: string
  venue: string
  merchant: string
  ticketsSold: number
  totalTickets: number
  revenue: string
  status: 'active' | 'pending' | 'completed' | 'cancelled'
  category: string
}

export function EventsSection() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const title = isAdmin ? 'All Events' : 'My Events'
  
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    startDate: '',
    endDate: ''
  })
  
  const { events, loading, error, refetch } = useEventsData(filters)

  const getStatusBadge = (status: EventData['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      completed: 'outline',
      cancelled: 'destructive'
    } as const

    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    } as const

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Music': 'bg-purple-100 text-purple-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Sports': 'bg-green-100 text-green-800',
      'Art': 'bg-pink-100 text-pink-800',
      'Business': 'bg-gray-100 text-gray-800'
    } as const

    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    )
  }

  const totalStats = events.reduce((acc, event) => ({
    totalEvents: acc.totalEvents + 1,
    activeEvents: acc.activeEvents + (event.status === 'active' ? 1 : 0),
    totalTicketsSold: acc.totalTicketsSold + event.ticketsSold,
    totalRevenue: acc.totalRevenue + parseFloat(event.revenue.replace(/[$,]/g, ''))
  }), { totalEvents: 0, activeEvents: 0, totalTicketsSold: 0, totalRevenue: 0 })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isAdmin ? 'Manage and monitor all platform events' : 'Manage and monitor your events'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-center h-16">
                  <LoadingSpinner />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isAdmin ? 'Manage and monitor all platform events' : 'Manage and monitor your events'}
            </p>
          </div>
        </div>
        <ErrorDisplay message={error} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isAdmin ? 'Manage and monitor all platform events' : 'Manage and monitor your events'}
          </p>
        </div>
        {!isAdmin && (
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-2xl font-bold">{totalStats.totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Events</p>
                <p className="text-2xl font-bold">{totalStats.activeEvents}</p>
              </div>
              <Ticket className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tickets Sold</p>
                <p className="text-2xl font-bold">{totalStats.totalTicketsSold.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</p>
              </div>
              <Ticket className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium">Status:</label>
              <select 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Category:</label>
              <select 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="Art">Art</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Date Range:</label>
              <input 
                type="date" 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <span>to</span>
              <input 
                type="date" 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{title}</span>
            </span>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                {isAdmin && <TableHead>Merchant</TableHead>}
                <TableHead>Category</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-gray-500">ID: {event.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{event.venue}</span>
                  </TableCell>
                  {isAdmin && <TableCell>{event.merchant}</TableCell>}
                  <TableCell>{getCategoryBadge(event.category)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{event.ticketsSold.toLocaleString()}</div>
                      <div className="text-gray-500">of {event.totalTickets.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{event.revenue}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!isAdmin && (
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {!isAdmin && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-6 w-6" />
                <span>Create Event</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Ticket className="h-6 w-6" />
                <span>Manage Tickets</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MapPin className="h-6 w-6" />
                <span>Add Venue</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Download className="h-6 w-6" />
                <span>Export Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}