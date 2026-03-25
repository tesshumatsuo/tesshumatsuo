import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const correctUsername = process.env.STUDIO_LOGIN_NAME
    const correctPassword = process.env.STUDIO_LOGIN_PASS

    if (username === correctUsername && password === correctPassword) {
      const cookieStore = await cookies()
      cookieStore.set('studio-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  } catch (error: any) {
    console.error('Login API error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
