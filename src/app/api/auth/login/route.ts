import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyPassword, generateToken, validateEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Ошибка базы данных' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    // Skip email verification check for now to avoid 500s while setting up

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email)

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      usageCountDay: user.usageCountDay,
      usageCountMonth: user.usageCountMonth,
    }

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userData
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}