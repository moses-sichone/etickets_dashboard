import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const eventId = searchParams.get('eventId') || ''
    const status = searchParams.get('status') || ''

    // Forward to backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const token = request.headers.get('authorization') || ''

    const queryParams = new URLSearchParams({
      format,
      eventId,
      status
    })

    const response = await fetch(`${backendUrl}/api/attendees/export?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    // Handle file download
    const data = await response.blob()
    const headers = new Headers()
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream')
    headers.set('Content-Disposition', response.headers.get('Content-Disposition') || `attachment; filename="attendees.${format}"`)

    return new NextResponse(data, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Export attendees error:', error)
    return NextResponse.json(
      { error: 'Failed to export attendees' },
      { status: 500 }
    )
  }
}