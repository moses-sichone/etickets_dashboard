'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Calendar, MapPin, Ticket, Download, Eye, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface AttendeeData {
  id: string
  name: string
  email: string
  phone: string
  event: string
  eventDate: string
  tickets: number
  totalAmount: string
  purchaseDate: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

const mockAttendees: AttendeeData[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    event: 'Summer Music Festival',
    eventDate: 'Jul 15, 2024',
    tickets: 2,
    totalAmount: '$178',
    purchaseDate: 'Jul 10, 2024',
    status: 'confirmed'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 987-6543',
    event: 'AI & ML Summit',
    eventDate: 'Aug 20, 2024',
    tickets: 1,
    totalAmount: '$299',
    purchaseDate: 'Jul 12, 2024',
    status: 'confirmed'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.w@email.com',
    phone: '+1 (555) 456-7890',
    event: 'Championship Finals',
    eventDate: 'Sep 5, 2024',
    tickets: 4,
    totalAmount: '$600',
    purchaseDate: 'Jul 14, 2024',
    status: 'pending'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 321-0987',
    event: 'Summer Music Festival',
    eventDate: 'Jul 15, 2024',
    tickets: 1,
    totalAmount: '$89',
    purchaseDate: 'Jul 8, 2024',
    status: 'confirmed'
  }
]

export function AttendeesSection() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const getStatusBadge = (status: AttendeeData['status']) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const totalStats = mockAttendees.reduce((acc, attendee) => ({
    totalAttendees: acc.totalAttendees + 1,
    totalTickets: acc.totalTickets + attendee.tickets,
    totalRevenue: acc.totalRevenue + parseFloat(attendee.totalAmount.replace(/[$,]/g, '')),
    confirmedAttendees: acc.confirmedAttendees + (attendee.status === 'confirmed' ? 1 : 0)
  }), { totalAttendees: 0, totalTickets: 0, totalRevenue: 0, confirmedAttendees: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendees</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor all event attendees across the platform
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email All
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Attendees</p>
                <p className="text-2xl font-bold">{totalStats.totalAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
                <p className="text-2xl font-bold">{totalStats.totalTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl font-bold">{totalStats.confirmedAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
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
              <label className="text-sm font-medium">Status:</label>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option value="">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Event:</label>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option value="">All Events</option>
                <option value="Summer Music Festival">Summer Music Festival</option>
                <option value="AI & ML Summit">AI & ML Summit</option>
                <option value="Championship Finals">Championship Finals</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Date Range:</label>
              <input type="date" className="px-3 py-1 border border-gray-300 rounded-md text-sm" />
              <span>to</span>
              <input type="date" className="px-3 py-1 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>All Attendees</span>
            </span>
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{attendee.name}</div>
                      <div className="text-sm text-gray-500">ID: {attendee.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{attendee.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{attendee.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{attendee.event}</span>
                    </div>
                  </TableCell>
                  <TableCell>{attendee.eventDate}</TableCell>
                  <TableCell>{attendee.tickets}</TableCell>
                  <TableCell className="font-medium">{attendee.totalAmount}</TableCell>
                  <TableCell>{attendee.purchaseDate}</TableCell>
                  <TableCell>{getStatusBadge(attendee.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Mail className="h-6 w-6" />
              <span>Send Bulk Email</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Download className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Segment Attendees</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}