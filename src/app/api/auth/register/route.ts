import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Формируем абсолютный URL редиректа для письма
    const origin = request.headers.get('origin') || process.env.SITE_URL || 'http://localhost:3000'
    const redirectTo = `${origin.replace(/\/$/, '')}/auth/callback`

    const result = await signUp(email, password, name, redirectTo)

    if (result.needsEmailConfirmation) {
      return NextResponse.json({
        message: 'Registration successful. Please check your email to confirm your account.',
        needsEmailConfirmation: true,
        user: {
          id: result.user?.id,
          email: result.user?.email,
        }
      })
    }

    const response = NextResponse.json({
      message: 'User created and logged in successfully',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.user_metadata?.name,
      }
    })

    // Set access token cookie for server-side API auth
    const accessToken = result.session?.access_token
    if (accessToken) {
      response.cookies.set('sb-access-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return response
  } catch (error: any) {
    console.error('Registration error:', error)
    
    let statusCode = 500
    let errorMessage = 'Internal server error'
    
    if (error.message?.includes('User already registered')) {
      statusCode = 409
      errorMessage = 'User with this email already exists'
    } else if (error.message?.includes('Password should be at least')) {
      statusCode = 400
      errorMessage = 'Password should be at least 6 characters'
    } else if (error.message?.includes('Invalid email')) {
      statusCode = 400
      errorMessage = 'Invalid email format'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}