'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, Star, ShoppingCart, Undo, Eye, LineChart, BarChart3 } from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend
} from 'recharts'

interface AnalyticsData {
  metric: string
  current: number
  previous: number
  change: number
  changeType: 'positive' | 'negative'
}

interface TopEvent {
  name: string
  ticketsSold: number
  revenue: string
  conversionRate: number
  rating: number
  status: 'active' | 'pending'
}

const mockAnalytics: AnalyticsData[] = [
  { metric: 'Conversion Rate', current: 85, previous: 80, change: 5, changeType: 'positive' },
  { metric: 'Avg. Order Value', current: 75, previous: 70, change: 5, changeType: 'positive' },
  { metric: 'Return Rate', current: 12, previous: 14, change: -2, changeType: 'negative' },
  { metric: 'Avg. Rating', current: 4.2, previous: 4.0, change: 0.2, changeType: 'positive' }
]

const mockTopEvents: TopEvent[] = [
  {
    name: 'Summer Music Festival',
    ticketsSold: 1245,
    revenue: '$45,230',
    conversionRate: 92,
    rating: 4.5,
    status: 'active'
  },
  {
    name: 'Championship Finals',
    ticketsSold: 850,
    revenue: '$32,500',
    conversionRate: 88,
    rating: 4.7,
    status: 'active'
  },
  {
    name: 'AI & ML Summit',
    ticketsSold: 420,
    revenue: '$28,900',
    conversionRate: 85,
    rating: 4.3,
    status: 'pending'
  }
]

// Sample data for charts
const salesTrendData = [
  { month: 'Jan', revenue: 30000, conversion: 80 },
  { month: 'Feb', revenue: 35000, conversion: 82 },
  { month: 'Mar', revenue: 32000, conversion: 81 },
  { month: 'Apr', revenue: 40000, conversion: 85 },
  { month: 'May', revenue: 45000, conversion: 87 },
  { month: 'Jun', revenue: 50000, conversion: 88 },
  { month: 'Jul', revenue: 55000, conversion: 90 }
]

const performanceMetricsData = [
  { metric: 'Tickets Sold', current: 85, previous: 75 },
  { metric: 'Conversion Rate', current: 65, previous: 60 },
  { metric: 'Avg. Order Value', current: 75, previous: 70 },
  { metric: 'Return Rate', current: 20, previous: 25 }
]

export function AnalyticsSection() {
  const getChangeBadge = (change: number, changeType: 'positive' | 'negative') => {
    const isPositive = changeType === 'positive' ? change > 0 : change < 0
    const color = isPositive ? 'text-green-600' : 'text-red-600'
    const icon = isPositive ? '↑' : '↓'
    
    return (
      <span className={`text-sm font-medium ${color}`}>
        {icon} {Math.abs(change)}{typeof change === 'number' && change % 1 !== 0 ? '' : '%'}
      </span>
    )
  }

  const getStatusBadge = (status: TopEvent['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Performance metrics and insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Week</Button>
          <Button variant="outline">Month</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">Year</Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mockAnalytics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.metric}</p>
                {index === 0 && <TrendingUp className="h-5 w-5 text-indigo-600" />}
                {index === 1 && <ShoppingCart className="h-5 w-5 text-green-600" />}
                {index === 2 && <Undo className="h-5 w-5 text-yellow-600" />}
                {index === 3 && <Star className="h-5 w-5 text-purple-600" />}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">
                  {metric.current}{typeof metric.current === 'number' && metric.current % 1 !== 0 ? '' : metric.metric.includes('Rate') || metric.metric.includes('Rating') ? '%' : ''}
                </p>
                {getChangeBadge(metric.change, metric.changeType)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Previous: {metric.previous}{typeof metric.previous === 'number' && metric.previous % 1 !== 0 ? '' : metric.metric.includes('Rate') || metric.metric.includes('Rating') ? '%' : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5" />
              <span>Sales Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={{ fill: '#6366f1' }}
                    name="Revenue ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversion" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                    name="Conversion Rate (%)"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={performanceMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#6366f1" name="Current" />
                  <Bar dataKey="previous" fill="#10b981" name="Previous" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Performing Events</span>
            </span>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Tickets Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTopEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.ticketsSold.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{event.revenue}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${event.conversionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{event.conversionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{event.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
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