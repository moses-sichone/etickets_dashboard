import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // Forward to backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const token = request.headers.get('authorization') || ''

    const queryParams = new URLSearchParams({
      page,
      limit,
      search,
      status
    })

    const response = await fetch(`${backendUrl}/api/venues/?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Venues API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const token = request.headers.get('authorization') || ''

    const response = await fetch(`${backendUrl}/api/venues/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Create venue error:', error)
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    )
  }
}