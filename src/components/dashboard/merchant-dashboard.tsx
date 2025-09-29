'use client'

import { StatsCard } from './stats-card'
import { ChartCard } from './chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from './loading-spinner'
import { ErrorDisplay } from './error-display'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { 
  Calendar, 
  Ticket, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  ChartBar,
  Users,
  Plus,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  CreditCard,
  LineChart,
  PieChart,
  BarChart3
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend
} from 'recharts'

export function MerchantDashboard() {
  const { data, loading, error, refetch } = useDashboardData()

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={refetch} />
  }

  if (!data) {
    return <ErrorDisplay message="No data available" onRetry={refetch} />
  }

  const { stats, recentEvents = [], upcomingEvents = [], recentSales = [] } = data

  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 12000, tickets: 150 },
    { month: 'Feb', sales: 15000, tickets: 180 },
    { month: 'Mar', sales: 18000, tickets: 220 },
    { month: 'Apr', sales: 22000, tickets: 270 },
    { month: 'May', sales: 25000, tickets: 310 },
    { month: 'Jun', sales: 28000, tickets: 350 },
    { month: 'Jul', sales: 32000, tickets: 400 }
  ]

  const eventPerformanceData = [
    { name: 'Summer Music Festival', tickets: 450, revenue: 45000, fill: '#6366f1' },
    { name: 'Tech Conference 2024', tickets: 200, revenue: 60000, fill: '#8b5cf6' },
    { name: 'Food & Wine Expo', tickets: 180, revenue: 36000, fill: '#10b981' },
    { name: 'Art Exhibition', tickets: 150, revenue: 22500, fill: '#f59e0b' },
    { name: 'Winter Jazz Festival', tickets: 120, revenue: 30000, fill: '#ef4444' }
  ]

  const revenueDistributionData = [
    { name: 'Net Earnings', value: 75, color: '#10b981' },
    { name: 'Commission', value: 15, color: '#6366f1' },
    { name: 'Taxes', value: 10, color: '#f59e0b' }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Merchant Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your events and performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
          <Button variant="outline">
            <MapPinIcon className="mr-2 h-4 w-4" />
            Manage Venues
          </Button>
          <Button variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            View Payouts
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="My Events"
          value={stats.myEvents || '0'}
          description="Active events"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Tickets Sold"
          value={stats.ticketsSold?.toLocaleString() || '0'}
          description="Total tickets sold"
          icon={Ticket}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="My Venues"
          value={stats.myVenues || '0'}
          description="Registered venues"
          icon={MapPin}
          trend={{ value: 0, isPositive: false }}
        />
        <StatsCard
          title="Revenue"
          value={`$${stats.revenue?.toLocaleString() || '0'}`}
          description="This month's revenue"
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <Plus className="h-6 w-6" />
              <span>Create Event</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Ticket className="h-6 w-6" />
              <span>Generate Tickets</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MapPin className="h-6 w-6" />
              <span>Add Venue</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales Overview" icon={TrendingUp}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ fill: '#6366f1' }}
                  name="Sales ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Tickets Sold"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Event Performance" icon={ChartBar}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={eventPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tickets" fill="#6366f1" name="Tickets Sold" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Revenue Distribution */}
      <ChartCard title="Revenue Distribution" icon={PieChart}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={revenueDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {revenueDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Recent Events & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.tickets} tickets</p>
                  </div>
                  <Badge variant="outline">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.tickets} tickets</p>
                  </div>
                  <Badge variant="default">
                    Upcoming
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Recent Sales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">{sale.event}</p>
                  <p className="text-xs text-muted-foreground">{sale.tickets} tickets</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{sale.amount}</p>
                  <p className="text-xs text-muted-foreground">{sale.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}