import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth-simple'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await signIn(email, password)
    
    if (!result.user) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.user_metadata?.name,
        subscriptionStatus: 'FREE',
        usageCountDay: 0,
        usageCountMonth: 0,
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    
    let statusCode = 500
    let errorMessage = 'Internal server error'
    
    if (error.message?.includes('Invalid login credentials')) {
      statusCode = 401
      errorMessage = 'Invalid credentials'
    } else if (error.message?.includes('Email not confirmed')) {
      statusCode = 401
      errorMessage = 'Please confirm your email before logging in'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}