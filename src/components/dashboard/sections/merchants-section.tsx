'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Store, Users, DollarSign, Clock, Plus, Eye, Edit } from 'lucide-react'
import { useMerchantsData } from '@/hooks/use-merchants-data'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function MerchantsSection() {
  const { merchants, loading, error, refetch } = useMerchantsData()

  const getStatusBadge = (status: 'active' | 'pending' | 'suspended' | 'rejected') => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive',
      rejected: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const totalStats = merchants.reduce((acc, merchant) => ({
    totalMerchants: acc.totalMerchants + 1,
    totalEvents: acc.totalEvents + merchant.events,
    totalTicketsSold: acc.totalTicketsSold + merchant.ticketsSold,
    totalRevenue: acc.totalRevenue + parseFloat(merchant.revenue.replace(/[$,]/g, '')),
    totalCommission: acc.totalCommission + parseFloat(merchant.commission.replace(/[$,]/g, ''))
  }), { totalMerchants: 0, totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0, totalCommission: 0 })

  return (
    <div className="space-y-6">
      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading merchants: {error}
            <Button variant="link" onClick={refetch} className="ml-2 p-0 h-auto">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Merchants</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage merchant accounts and onboarding
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Onboard Merchant
          </Button>
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Pending Applications
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Merchants</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{totalStats.totalMerchants}</p>
                )}
              </div>
              <Store className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">
                    {merchants.filter(m => m.status === 'pending').length}
                  </p>
                )}
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Merchants</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">
                    {merchants.filter(m => m.status === 'active').length}
                  </p>
                )}
              </div>
              <Store className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</p>
                )}
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Commission</p>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold">${totalStats.totalCommission.toLocaleString()}</p>
                )}
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merchants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>All Merchants</span>
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
                <TableHead>Merchant</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Tickets Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : merchants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="text-gray-500">
                      <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No merchants found</p>
                      <p className="text-sm">Create your first merchant to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                merchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.name}</TableCell>
                    <TableCell>{merchant.businessType}</TableCell>
                    <TableCell>{merchant.contactPerson}</TableCell>
                    <TableCell>{merchant.contactEmail}</TableCell>
                    <TableCell>{merchant.events}</TableCell>
                    <TableCell>{merchant.ticketsSold.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{merchant.revenue}</TableCell>
                    <TableCell className="font-medium">{merchant.commission}</TableCell>
                    <TableCell>{getStatusBadge(merchant.status)}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}