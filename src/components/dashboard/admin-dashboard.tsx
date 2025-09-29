'use client'

import { useState } from 'react'
import { StatsCard } from './stats-card'
import { ChartCard } from './chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from './loading-spinner'
import { ErrorDisplay } from './error-display'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAnalyticsData } from '@/hooks/use-analytics-data'
import { useRevenueData } from '@/hooks/use-revenue-data'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateEventForm } from '@/components/forms/create-event-form'
import { OnboardMerchantForm } from '@/components/forms/onboard-merchant-form'
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
  const { data, loading: dashboardLoading, error: dashboardError, refetch } = useDashboardData()
  const { metrics, performance, topEvents, trends, loading: analyticsLoading, error: analyticsError } = useAnalyticsData()
  const { revenue, distribution, loading: revenueLoading, error: revenueError } = useRevenueData()

  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showMerchantDialog, setShowMerchantDialog] = useState(false)

  const loading = dashboardLoading || analyticsLoading || revenueLoading
  const error = dashboardError || analyticsError || revenueError

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

  // Use real analytics data or fallback to sample data
  const revenueData = performance?.revenue_by_period || [
    { period: 'Jan', revenue: 40000, tickets_sold: 1200 },
    { period: 'Feb', revenue: 45000, tickets_sold: 1350 },
    { period: 'Mar', revenue: 38000, tickets_sold: 1100 },
    { period: 'Apr', revenue: 52000, tickets_sold: 1600 },
    { period: 'May', revenue: 48000, tickets_sold: 1450 },
    { period: 'Jun', revenue: 58000, tickets_sold: 1750 },
    { period: 'Jul', revenue: 65000, tickets_sold: 1950 }
  ]

  const categoryData = distribution?.by_category || [
    { category: 'Music', revenue: 35, percentage: 35 },
    { category: 'Sports', revenue: 25, percentage: 25 },
    { category: 'Technology', revenue: 20, percentage: 20 },
    { category: 'Business', revenue: 15, percentage: 15 },
    { category: 'Art', revenue: 5, percentage: 5 }
  ]

  const userActivityData = performance?.user_activity || [
    { period: 'Mon', active_users: 1200, new_users: 45 },
    { period: 'Tue', active_users: 1350, new_users: 52 },
    { period: 'Wed', active_users: 1100, new_users: 38 },
    { period: 'Thu', active_users: 1400, new_users: 65 },
    { period: 'Fri', active_users: 1600, new_users: 78 },
    { period: 'Sat', active_users: 1800, new_users: 92 },
    { period: 'Sun', active_users: 2100, new_users: 105 }
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
          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <CreateEventForm 
                onSuccess={() => {
                  setShowEventDialog(false)
                  refetch()
                }}
                onCancel={() => setShowEventDialog(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showMerchantDialog} onOpenChange={setShowMerchantDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Onboard Merchant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Onboard New Merchant</DialogTitle>
              </DialogHeader>
              <OnboardMerchantForm 
                onSuccess={() => {
                  setShowMerchantDialog(false)
                  refetch()
                }}
                onCancel={() => setShowMerchantDialog(false)}
              />
            </DialogContent>
          </Dialog>

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
          value={metrics?.total_users?.toLocaleString() || stats.totalUsers?.toLocaleString() || '0'}
          description="Active users in the system"
          icon={Users}
          trend={{ value: metrics?.monthly_growth || 12, isPositive: true }}
        />
        <StatsCard
          title="Active Events"
          value={metrics?.active_events?.toLocaleString() || stats.activeEvents?.toLocaleString() || '0'}
          description="Currently active events"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Tickets Sold"
          value={metrics?.total_tickets_sold?.toLocaleString() || stats.ticketsSold?.toLocaleString() || '0'}
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
          value={`$${revenue?.total_revenue?.toLocaleString() || metrics?.total_revenue?.toLocaleString() || stats.totalRevenue?.toLocaleString() || '0'}`}
          description="Revenue this month"
          icon={DollarSign}
          trend={{ value: metrics?.monthly_growth || stats.monthlyGrowth || 0, isPositive: true }}
        />
        <StatsCard
          title="Monthly Growth"
          value={`${metrics?.monthly_growth || stats.monthlyGrowth || 0}%`}
          description="Compared to last month"
          icon={TrendingUp}
          trend={{ value: metrics?.monthly_growth || stats.monthlyGrowth || 0, isPositive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${metrics?.conversion_rate || stats.conversionRate || 0}%`}
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
                <XAxis dataKey="period" />
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
                  dataKey="tickets_sold" 
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
                  dataKey="percentage"
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
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
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active_users" fill="#6366f1" name="Active Users" />
              <Bar dataKey="new_users" fill="#10b981" name="New Users" />
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