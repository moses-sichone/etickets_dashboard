import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { refresh } = await request.json()

    if (!refresh) {
      return NextResponse.json(
        { success: false, message: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Forward the request to the real backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to refresh token' },
        { status: backendResponse.status }
      )
    }

    // Transform the response to match our frontend format
    return NextResponse.json({
      success: true,
      data: {
        access: data.access,
      }
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}