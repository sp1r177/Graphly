import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Простая регистрация - начало')
    
    const { email, password, name } = await request.json()
    console.log('📝 Получены данные:', { email, name, passwordLength: password?.length })

    if (!email || !password) {
      console.log('❌ Отсутствуют обязательные поля')
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      console.log('❌ Неверный формат email')
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log('❌ Неверный пароль:', passwordValidation.message)
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    console.log('✅ Валидация прошла успешно')

    // Check if user already exists
    console.log('🔍 Проверяем существующего пользователя...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ Пользователь уже существует')
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    console.log('✅ Пользователь не существует, продолжаем')

    // Hash password
    console.log('🔐 Хешируем пароль...')
    const hashedPassword = await hashPassword(password)
    console.log('✅ Пароль захеширован')

    // Generate simple verification token
    const emailVerificationToken = Math.random().toString(36).substring(2, 15) + 
                                  Math.random().toString(36).substring(2, 15)
    console.log('🎫 Токен подтверждения сгенерирован')

    // Create user
    console.log('👤 Создаем пользователя...')
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        subscriptionStatus: 'FREE',
        usageCountDay: 0,
        usageCountMonth: 0,
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

    console.log('✅ Пользователь создан:', user)

    return NextResponse.json({
      message: 'Регистрация прошла успешно! Теперь вы можете войти.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      // no verification token in simplified flow
    })

  } catch (error) {
    console.error('❌ Ошибка регистрации:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      console.error('❌ Детали ошибки:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Database') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Ошибка подключения к базе данных. Проверьте настройки.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('column') || error.message.includes('field')) {
        return NextResponse.json(
          { error: 'Ошибка структуры базы данных. Обновите схему.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
