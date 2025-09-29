'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Ticket, Users, DollarSign, Calendar, Download, Eye } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface TicketData {
  id: string
  event: string
  ticketType: string
  price: string
  sold: number
  available: number
  revenue: string
  status: 'active' | 'pending' | 'sold-out'
}

const mockTickets: TicketData[] = [
  {
    id: '1',
    event: 'Summer Music Festival',
    ticketType: 'General Admission',
    price: '$89',
    sold: 1000,
    available: 200,
    revenue: '$89,000',
    status: 'active'
  },
  {
    id: '2',
    event: 'Summer Music Festival',
    ticketType: 'VIP',
    price: '$250',
    sold: 245,
    available: 55,
    revenue: '$61,250',
    status: 'active'
  },
  {
    id: '3',
    event: 'AI & ML Summit',
    ticketType: 'Standard',
    price: '$299',
    sold: 320,
    available: 180,
    revenue: '$95,680',
    status: 'pending'
  },
  {
    id: '4',
    event: 'Championship Finals',
    ticketType: 'Premium',
    price: '$150',
    sold: 850,
    available: 0,
    revenue: '$127,500',
    status: 'sold-out'
  }
]

export function TicketsSection() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const title = isAdmin ? 'All Tickets' : 'My Tickets'

  const getStatusBadge = (status: TicketData['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      'sold-out': 'destructive'
    } as const

    const labels = {
      active: 'Active',
      pending: 'Pending',
      'sold-out': 'Sold Out'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const totalStats = mockTickets.reduce((acc, ticket) => ({
    totalSold: acc.totalSold + ticket.sold,
    totalAvailable: acc.totalAvailable + ticket.available,
    totalRevenue: acc.totalRevenue + parseFloat(ticket.revenue.replace(/[$,]/g, ''))
  }), { totalSold: 0, totalAvailable: 0, totalRevenue: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isAdmin ? 'Manage ticket sales and inventory across the platform' : 'Manage your ticket sales and inventory'}
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tickets Sold</p>
                <p className="text-2xl font-bold">{totalStats.totalSold.toLocaleString()}</p>
              </div>
              <Ticket className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold">{totalStats.totalAvailable.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Events</p>
                <p className="text-2xl font-bold">
                  {new Set(mockTickets.map(t => t.event)).size}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Ticket className="h-5 w-5" />
              <span>Ticket Sales</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Ticket Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.event}</TableCell>
                  <TableCell>{ticket.ticketType}</TableCell>
                  <TableCell className="font-medium">{ticket.price}</TableCell>
                  <TableCell>{ticket.sold.toLocaleString()}</TableCell>
                  <TableCell className={ticket.available === 0 ? 'text-red-600' : ''}>
                    {ticket.available.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{ticket.revenue}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}