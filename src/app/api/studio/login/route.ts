import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs' // Force Node.js runtime
export const dynamic = 'force-dynamic' // Ensure it's not statically optimized

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Clean up potential accidental quotes or spaces from Vercel ENV
    const correctUsername = process.env.STUDIO_LOGIN_NAME?.replace(/['"]/g, '')?.trim()
    const correctPassword = process.env.STUDIO_LOGIN_PASS?.replace(/['"]/g, '')?.trim()
    
    const inputUsername = username?.trim()
    const inputPassword = password?.trim()

    console.log('--- Login Attempt ---')
    console.log(`Received username: "${inputUsername}"`)
    console.log(`Correct username config exists: ${!!correctUsername} (Length: ${correctUsername?.length})`)
    console.log(`Correct password config exists: ${!!correctPassword} (Length: ${correctPassword?.length})`)
    console.log(`Passwords match: ${inputPassword === correctPassword}`)

    if (inputUsername === correctUsername && inputPassword === correctPassword) {
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
