import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_password'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_logged_in', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    return response
  } else {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
}

