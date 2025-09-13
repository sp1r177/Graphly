import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Токен подтверждения обязателен' },
        { status: 400 }
      )
    }

    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный токен подтверждения' },
        { status: 400 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email уже подтвержден' },
        { status: 400 }
      )
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        subscriptionStatus: true,
        usageCountDay: true,
        usageCountMonth: true,
      }
    })

    // Generate JWT token for auto-login
    const authToken = generateToken(updatedUser.id, updatedUser.email)

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'Email успешно подтвержден!',
      user: updatedUser
    })

    response.cookies.set('auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return response

  } catch (error) {
    console.error('Email verification error:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера. Попробуйте позже.' },
      { status: 500 }
    )
  }
}
