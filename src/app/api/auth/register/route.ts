import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword, generateToken, validateEmail, validatePassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user in Supabase table `users`
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        name: name || null,
        subscriptionStatus: 'FREE',
        usageCountDay: 0,
        usageCountMonth: 0,
      })
      .select('id,email,name,subscriptionStatus,usageCountDay,usageCountMonth')
      .single()

    if (error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({
      message: 'Регистрация прошла успешно!',
      user: data,
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Database')) {
        return NextResponse.json(
          { error: 'Ошибка подключения к базе данных. Попробуйте позже.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера. Попробуйте позже.' },
      { status: 500 }
    )
  }
}