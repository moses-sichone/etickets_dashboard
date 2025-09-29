import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/events/${params.id}/`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch event' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Event detail API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/events/${params.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update event' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Update event API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/events/${params.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update event' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Patch event API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/events/${params.id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to delete event' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Delete event API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete event' },
      { status: 500 }
    )
  }
}