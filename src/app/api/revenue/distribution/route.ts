import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    
    // Build query parameters
    const queryParams = new URLSearchParams()
    if (searchParams.get('period')) queryParams.append('period', searchParams.get('period')!)
    if (searchParams.get('merchant_id')) queryParams.append('merchant_id', searchParams.get('merchant_id')!)
    
    const queryString = queryParams.toString()
    const url = `${process.env.BACKEND_API_URL}/api/revenue/distribution${queryString ? `?${queryString}` : ''}`
    
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
        { success: false, message: data.message || 'Failed to fetch revenue distribution' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Revenue distribution API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch revenue distribution' },
      { status: 500 }
    )
  }
}