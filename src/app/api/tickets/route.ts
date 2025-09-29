import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    
    // Build query parameters for filtering
    const queryParams = new URLSearchParams()
    if (searchParams.get('status')) queryParams.append('status', searchParams.get('status')!)
    if (searchParams.get('event_id')) queryParams.append('event_id', searchParams.get('event_id')!)
    if (searchParams.get('page')) queryParams.append('page', searchParams.get('page')!)
    if (searchParams.get('page_size')) queryParams.append('page_size', searchParams.get('page_size')!)
    
    const queryString = queryParams.toString()
    const url = `${process.env.BACKEND_API_URL}/api/tickets/${queryString ? `?${queryString}` : ''}`
    
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
        { success: false, message: data.message || 'Failed to fetch tickets' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tickets API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}