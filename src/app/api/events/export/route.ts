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
    const url = `${process.env.BACKEND_API_URL}/api/events/export/${queryString ? `?${queryString}` : ''}`
    
    const backendResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const data = await backendResponse.json()
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to export events' },
        { status: backendResponse.status }
      )
    }

    // If the response is a file (CSV/Excel), return it as-is
    const contentType = backendResponse.headers.get('content-type')
    if (contentType && (contentType.includes('csv') || contentType.includes('excel') || contentType.includes('octet-stream'))) {
      const blob = await backendResponse.blob()
      return new NextResponse(blob, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': backendResponse.headers.get('content-disposition') || 'attachment',
        },
      })
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Events export API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to export events' },
      { status: 500 }
    )
  }
}