import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Forward the request to the real backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await backendResponse.json()
    console.log('Backend login response data:', data)
    console.log('Backend response status:', JSON.stringify(data, null, 2))

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Invalid credentials' },
        { status: backendResponse.status }
      )
    }

    // Transform the response to match our frontend format
    return NextResponse.json({
      success: true,
      data: { // Wrap the response in a 'data' object to match the backend structure
        user: {
          id: data.data.user.id, // Get id from backend's data.data.user
          email: data.data.user.email, // Get email from backend's data.data.user
          name: data.data.user.username, // Get username from backend's data.data.user
          role: data.data.user.role, // Get role from backend's data.data.user
        },
        access: data.data.access, // Include access token from backend's data.data
        refresh: data.data.refresh, // Include refresh token from backend's data.data
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}