import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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

    let user
    
    try {
      // Try to find user in database
      user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

    } catch (dbError) {
      console.error('❌ БД недоступна для логина:', (dbError as Error).message)
      
      // Fallback: создаем временного пользователя для демо
      if (email === 'demo@example.com' && password === 'demo123') {
        console.log('⚠️  БД недоступна, используем демо-аккаунт')
        user = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          name: 'Demo User',
          subscriptionStatus: 'FREE',
          usageCountDay: 0,
          usageCountMonth: 0,
        }
      } else {
        return NextResponse.json(
          { error: 'Database unavailable. Try demo account: demo@example.com / demo123' },
          { status: 503 }
        )
      }
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