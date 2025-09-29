'use client'

import { StatsCard } from './stats-card'
import { ChartCard } from './chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from './loading-spinner'
import { ErrorDisplay } from './error-display'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Calendar, 
  Ticket, 
  Store, 
  DollarSign, 
  TrendingUp, 
  ChartBar,
  Activity,
  AlertCircle,
  Plus,
  UserPlus,
  Download,
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

export function AdminDashboard() {
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

  const { stats, recentActivity = [], systemAlerts = [] } = data

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 40000, tickets: 1200 },
    { month: 'Feb', revenue: 45000, tickets: 1350 },
    { month: 'Mar', revenue: 38000, tickets: 1100 },
    { month: 'Apr', revenue: 52000, tickets: 1600 },
    { month: 'May', revenue: 48000, tickets: 1450 },
    { month: 'Jun', revenue: 58000, tickets: 1750 },
    { month: 'Jul', revenue: 65000, tickets: 1950 }
  ]

  const categoryData = [
    { name: 'Music', value: 35, color: '#6366f1' },
    { name: 'Sports', value: 25, color: '#8b5cf6' },
    { name: 'Technology', value: 20, color: '#10b981' },
    { name: 'Business', value: 15, color: '#f59e0b' },
    { name: 'Art', value: 5, color: '#ef4444' }
  ]

  const userActivityData = [
    { day: 'Mon', active: 1200, new: 45 },
    { day: 'Tue', active: 1350, new: 52 },
    { day: 'Wed', active: 1100, new: 38 },
    { day: 'Thu', active: 1400, new: 65 },
    { day: 'Fri', active: 1600, new: 78 },
    { day: 'Sat', active: 1800, new: 92 },
    { day: 'Sun', active: 2100, new: 105 }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform-wide overview and management
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Onboard Merchant
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers?.toLocaleString() || '0'}
          description="Active users in the system"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Events"
          value={stats.totalEvents?.toLocaleString() || '0'}
          description="Events created this month"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Tickets Sold"
          value={stats.ticketsSold?.toLocaleString() || '0'}
          description="Total tickets sold"
          icon={Ticket}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Active Merchants"
          value={stats.activeMerchants?.toLocaleString() || '0'}
          description="Verified merchants"
          icon={Store}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
          description="Revenue this month"
          icon={DollarSign}
          trend={{ value: stats.monthlyGrowth || 0, isPositive: true }}
        />
        <StatsCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth || 0}%`}
          description="Compared to last month"
          icon={TrendingUp}
          trend={{ value: stats.monthlyGrowth || 0, isPositive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate || 0}%`}
          description="Ticket conversion rate"
          icon={ChartBar}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" icon={TrendingUp}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={revenueData}>
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

        <ChartCard title="Event Categories" icon={PieChart}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* User Activity Chart */}
      <ChartCard title="User Activity" icon={Activity}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" fill="#6366f1" name="Active Users" />
              <Bar dataKey="new" fill="#10b981" name="New Users" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      alert.type === 'error' ? 'destructive' :
                      alert.type === 'warning' ? 'default' :
                      alert.type === 'success' ? 'default' : 'secondary'
                    }>
                      {alert.type}
                    </Badge>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}