import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const stats = {
      totalUsers: 12345,
      totalEvents: 1234,
      ticketsSold: 45678,
      activeMerchants: 567,
      totalRevenue: 234567,
      monthlyGrowth: 23,
      conversionRate: 3.4
    }

    const recentActivity = [
      { action: 'New event created', user: 'John Doe', time: '2 minutes ago' },
      { action: 'Merchant registration approved', user: 'Jane Smith', time: '15 minutes ago' },
      { action: 'Ticket batch generated', user: 'Mike Johnson', time: '1 hour ago' },
      { action: 'Revenue milestone reached', user: 'System', time: '2 hours ago' }
    ]

    const systemAlerts = [
      { type: 'warning', message: 'Server load is high', time: '5 minutes ago' },
      { type: 'info', message: 'Database backup completed', time: '1 hour ago' },
      { type: 'success', message: 'New merchant onboarded', time: '2 hours ago' },
      { type: 'error', message: 'Payment gateway delayed', time: '3 hours ago' }
    ]

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentActivity,
        systemAlerts
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin dashboard data' },
      { status: 500 }
    )
  }
}