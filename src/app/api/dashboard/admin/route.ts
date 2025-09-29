import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/dashboard/admin/`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch admin dashboard data' },
        { status: backendResponse.status }
      )
    }

    // Return the data as-is from the backend
    return NextResponse.json(data)
  } catch (error) {
    console.error('Admin dashboard API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin dashboard data' },
      { status: 500 }
    )
  }
}