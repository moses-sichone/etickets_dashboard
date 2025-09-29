'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DollarSign, Wallet, CreditCard, TrendingUp, Eye, LineChart, PieChart } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
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
  Legend
} from 'recharts'

interface RevenueData {
  id: string
  merchant: string
  amount: string
  period: string
  status: 'completed' | 'pending' | 'failed'
  date: string
}

const mockRevenueData: RevenueData[] = [
  {
    id: '1',
    merchant: 'Live Nation',
    amount: '$25,430',
    period: 'Jul 1-15, 2024',
    status: 'completed',
    date: 'Jul 16, 2024'
  },
  {
    id: '2',
    merchant: 'Sports Inc',
    amount: '$18,200',
    period: 'Jul 1-15, 2024',
    status: 'completed',
    date: 'Jul 16, 2024'
  },
  {
    id: '3',
    merchant: 'Tech Events Co',
    amount: '$12,500',
    period: 'Jul 1-15, 2024',
    status: 'pending',
    date: 'Jul 18, 2024'
  }
]

// Sample data for charts
const revenueTrendData = [
  { month: 'Jan', revenue: 30000 },
  { month: 'Feb', revenue: 35000 },
  { month: 'Mar', revenue: 32000 },
  { month: 'Apr', revenue: 40000 },
  { month: 'May', revenue: 45000 },
  { month: 'Jun', revenue: 50000 },
  { month: 'Jul', revenue: 55000 }
]

const revenueDistributionData = [
  { name: 'Merchant Earnings', value: 75, color: '#10b981' },
  { name: 'Platform Commission', value: 15, color: '#6366f1' },
  { name: 'Taxes', value: 10, color: '#f59e0b' }
]

export function RevenueSection() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const title = isAdmin ? 'Platform Revenue' : 'My Revenue'

  const getStatusBadge = (status: RevenueData['status']) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const totalStats = mockRevenueData.reduce((acc, payout) => ({
    totalRevenue: acc.totalRevenue + parseFloat(payout.amount.replace(/[$,]/g, '')),
    totalCompleted: acc.totalCompleted + (payout.status === 'completed' ? 1 : 0),
    totalPending: acc.totalPending + (payout.status === 'pending' ? 1 : 0)
  }), { totalRevenue: 0, totalCompleted: 0, totalPending: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isAdmin ? 'Platform-wide financial overview and payouts' : 'Your earnings and payout history'}
          </p>
        </div>
        <Button className={isAdmin ? "bg-indigo-600 hover:bg-indigo-700" : "bg-green-600 hover:bg-green-700"}>
          {isAdmin ? 'Process Payouts' : 'Request Payout'}
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isAdmin ? 'Platform Commission' : 'Commission Paid'}
                </p>
                <p className="text-2xl font-bold">
                  ${Math.round(totalStats.totalRevenue * 0.1).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isAdmin ? 'Merchant Earnings' : 'Net Earnings'}
                </p>
                <p className="text-2xl font-bold">
                  ${Math.round(totalStats.totalRevenue * 0.9).toLocaleString()}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid Out</p>
                <p className="text-2xl font-bold">
                  ${Math.round(totalStats.totalRevenue * 0.7).toLocaleString()}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5" />
              <span>Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                    name="Revenue ($)"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Revenue Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{isAdmin ? 'Payout History' : 'My Payouts'}</span>
            </span>
            <Button variant="outline" size="sm">
              Export History
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAdmin ? 'Merchant' : 'Payout ID'}</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRevenueData.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">
                    {isAdmin ? payout.merchant : `P-${payout.id.padStart(5, '0')}`}
                  </TableCell>
                  <TableCell className="font-medium">{payout.amount}</TableCell>
                  <TableCell>{payout.period}</TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell>{payout.date}</TableCell>
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