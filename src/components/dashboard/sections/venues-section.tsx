'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MapPin, Users, Calendar, TrendingUp, Plus, Eye, Edit } from 'lucide-react'

interface VenueData {
  id: string
  name: string
  location: string
  capacity: number
  upcomingEvents: number
  occupancyRate: number
  status: 'active' | 'pending' | 'maintenance'
}

const mockVenues: VenueData[] = [
  {
    id: '1',
    name: 'Central Park',
    location: '123 Park Avenue, New York',
    capacity: 5000,
    upcomingEvents: 3,
    occupancyRate: 82,
    status: 'active'
  },
  {
    id: '2',
    name: 'Blue Note Club',
    location: '456 Jazz Street, New York',
    capacity: 500,
    upcomingEvents: 2,
    occupancyRate: 75,
    status: 'active'
  },
  {
    id: '3',
    name: 'City Arena',
    location: '789 Arena Blvd, New York',
    capacity: 20000,
    upcomingEvents: 1,
    occupancyRate: 65,
    status: 'pending'
  }
]

export function VenuesSection() {
  const getStatusBadge = (status: VenueData['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      maintenance: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const totalStats = mockVenues.reduce((acc, venue) => ({
    totalVenues: acc.totalVenues + 1,
    totalCapacity: acc.totalCapacity + venue.capacity,
    totalUpcomingEvents: acc.totalUpcomingEvents + venue.upcomingEvents,
    avgOccupancyRate: acc.avgOccupancyRate + venue.occupancyRate
  }), { totalVenues: 0, totalCapacity: 0, totalUpcomingEvents: 0, avgOccupancyRate: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Venues</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your venues and availability
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Venue
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Venues</p>
                <p className="text-2xl font-bold">{totalStats.totalVenues}</p>
              </div>
              <MapPin className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Capacity</p>
                <p className="text-2xl font-bold">{totalStats.totalCapacity.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Occupancy</p>
                <p className="text-2xl font-bold">
                  {Math.round(totalStats.avgOccupancyRate / totalStats.totalVenues)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</p>
                <p className="text-2xl font-bold">{totalStats.totalUpcomingEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Venues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Your Venues</span>
            </span>
            <Button variant="outline" size="sm">
              Manage Availability
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Upcoming Events</TableHead>
                <TableHead>Occupancy Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVenues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell className="font-medium">{venue.name}</TableCell>
                  <TableCell className="text-sm">{venue.location}</TableCell>
                  <TableCell>{venue.capacity.toLocaleString()}</TableCell>
                  <TableCell>{venue.upcomingEvents}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${venue.occupancyRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{venue.occupancyRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(venue.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
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