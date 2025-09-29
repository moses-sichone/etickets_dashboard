import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    
    // Build query parameters
    const queryParams = new URLSearchParams()
    if (searchParams.get('format')) queryParams.append('format', searchParams.get('format')!)
    if (searchParams.get('period')) queryParams.append('period', searchParams.get('period')!)
    if (searchParams.get('merchant_id')) queryParams.append('merchant_id', searchParams.get('merchant_id')!)
    
    const queryString = queryParams.toString()
    const url = `${process.env.BACKEND_API_URL}/api/revenue/export${queryString ? `?${queryString}` : ''}`
    
    const backendResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to export revenue data' },
        { status: backendResponse.status }
      )
    }

    // Handle file download
    const contentType = backendResponse.headers.get('content-type')
    const contentDisposition = backendResponse.headers.get('content-disposition')
    
    if (contentType && contentType.includes('application/octet-stream')) {
      const blob = await backendResponse.blob()
      const headers = new Headers()
      headers.set('Content-Type', contentType)
      if (contentDisposition) {
        headers.set('Content-Disposition', contentDisposition)
      }
      
      return new NextResponse(blob, {
        status: 200,
        headers
      })
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Revenue export API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to export revenue data' },
      { status: 500 }
    )
  }
}