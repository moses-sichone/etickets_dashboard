import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const stats = {
      myEvents: 24,
      ticketsSold: 1234,
      myVenues: 5,
      revenue: 12345
    }

    const recentEvents = [
      { name: 'Summer Music Festival', date: '2024-07-15', tickets: '450/500', status: 'completed' },
      { name: 'Tech Conference 2024', date: '2024-06-20', tickets: '200/200', status: 'completed' },
      { name: 'Food & Wine Expo', date: '2024-05-10', tickets: '180/200', status: 'completed' },
      { name: 'Art Exhibition', date: '2024-04-05', tickets: '150/150', status: 'completed' }
    ]

    const upcomingEvents = [
      { name: 'Winter Jazz Festival', date: '2024-12-20', tickets: '120/300', status: 'upcoming' },
      { name: 'New Year Gala', date: '2024-12-31', tickets: '80/200', status: 'upcoming' },
      { name: 'Business Summit 2025', date: '2025-01-15', tickets: '45/150', status: 'upcoming' },
      { name: 'Valentine Concert', date: '2025-02-14', tickets: '25/100', status: 'upcoming' }
    ]

    const recentSales = [
      { event: 'Winter Jazz Festival', tickets: 5, amount: '$250', time: '2 minutes ago' },
      { event: 'New Year Gala', tickets: 2, amount: '$200', time: '15 minutes ago' },
      { event: 'Business Summit 2025', tickets: 3, amount: '$450', time: '1 hour ago' },
      { event: 'Valentine Concert', tickets: 1, amount: '$75', time: '2 hours ago' }
    ]

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentEvents,
        upcomingEvents,
        recentSales
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch merchant dashboard data' },
      { status: 500 }
    )
  }
}