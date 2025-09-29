import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const token = request.headers.get('authorization') || ''

    const response = await fetch(`${backendUrl}/api/venues/${params.id}/`, {
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
    console.error('Get venue error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venue' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const token = request.headers.get('authorization') || ''

    const response = await fetch(`${backendUrl}/api/venues/${params.id}/`, {
      method: 'PUT',
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
    console.error('Update venue error:', error)
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const token = request.headers.get('authorization') || ''

    const response = await fetch(`${backendUrl}/api/venues/${params.id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Delete venue error:', error)
    return NextResponse.json(
      { error: 'Failed to delete venue' },
      { status: 500 }
    )
  }
}