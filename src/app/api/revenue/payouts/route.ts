import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    
    // Build query parameters
    const queryParams = new URLSearchParams()
    if (searchParams.get('merchant_id')) queryParams.append('merchant_id', searchParams.get('merchant_id')!)
    if (searchParams.get('status')) queryParams.append('status', searchParams.get('status')!)
    if (searchParams.get('page')) queryParams.append('page', searchParams.get('page')!)
    if (searchParams.get('page_size')) queryParams.append('page_size', searchParams.get('page_size')!)
    
    const queryString = queryParams.toString()
    const url = `${process.env.BACKEND_API_URL}/api/revenue/payouts/${queryString ? `?${queryString}` : ''}`
    
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
        { success: false, message: data.message || 'Failed to fetch revenue payouts' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Revenue payouts API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch revenue payouts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/revenue/payouts/`, {
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
        { success: false, message: data.message || 'Failed to create payout' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create payout API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create payout' },
      { status: 500 }
    )
  }
}