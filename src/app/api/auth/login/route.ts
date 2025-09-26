import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Demo credentials validation
    if (email === 'admin@etickets.com' && password === 'password') {
      return NextResponse.json({
        success: true,
        user: {
          id: '1',
          email: 'admin@etickets.com',
          name: 'John Doe',
          role: 'ADMIN'
        }
      })
    }

    if (email === 'merchant@etickets.com' && password === 'password') {
      return NextResponse.json({
        success: true,
        user: {
          id: '2',
          email: 'merchant@etickets.com',
          name: 'Jane Smith',
          role: 'MERCHANT'
        }
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}