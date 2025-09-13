import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'
import { getUserProfile } from '@/lib/supabase'

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

    // Получаем профиль пользователя
    let userProfile = null
    try {
      userProfile = await getUserProfile(result.user.id)
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError)
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.user_metadata?.name || userProfile?.name,
        subscriptionStatus: userProfile?.subscription_status || 'FREE',
        usageCountDay: userProfile?.usage_count_day || 0,
        usageCountMonth: userProfile?.usage_count_month || 0,
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