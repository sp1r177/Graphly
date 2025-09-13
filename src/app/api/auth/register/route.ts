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

    const result = await signUp(email, password, name)

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

    return NextResponse.json({
      message: 'User created and logged in successfully',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.user_metadata?.name,
      }
    })
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