import { NextRequest, NextResponse } from 'next/server'
import { prisma, supabase } from '@/lib/db'
import { hashPassword, generateToken, validateEmail, validatePassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Registration Debug:')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден')
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден')
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден')
    console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден')
    
    const { email, password, name } = await request.json()
    console.log('Registration attempt for:', email)

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

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    const isDev = process.env.NODE_ENV !== 'production'
    let user
    try {
      // Попытка создать реального пользователя в БД
      const hashed = await hashPassword(password)
      user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          name: name || null,
          subscriptionStatus: 'FREE',
        },
        select: {
          id: true,
          email: true,
          name: true,
          subscriptionStatus: true,
          usageCountDay: true,
          usageCountMonth: true,
        }
      })
    } catch (dbError) {
      console.warn('DB create user failed, fallback to mock (dev only):', (dbError as Error).message)
      if (!isDev) {
        throw dbError
      }
      user = {
        id: 'mock-user-id',
        email,
        name: name || null,
        subscriptionStatus: 'FREE' as const,
        usageCountDay: 0,
        usageCountMonth: 0,
      }
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email)

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'User created successfully',
      user
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}