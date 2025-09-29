import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    
    // Build query parameters for filtering
    const queryParams = new URLSearchParams()
    if (searchParams.get('status')) queryParams.append('status', searchParams.get('status')!)
    if (searchParams.get('category')) queryParams.append('category', searchParams.get('category')!)
    if (searchParams.get('startDate')) queryParams.append('startDate', searchParams.get('startDate')!)
    if (searchParams.get('endDate')) queryParams.append('endDate', searchParams.get('endDate')!)
    
    const queryString = queryParams.toString()
    const url = `${process.env.BACKEND_API_URL}/api/events/${queryString ? `?${queryString}` : ''}`
    
    const backendResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch events' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/events/`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create event' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create event API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create event' },
      { status: 500 }
    )
  }
}