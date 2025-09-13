import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Тестируем подключение к Supabase...')
    
    // Проверяем переменные окружения
    const envCheck = {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
      NODE_ENV: process.env.NODE_ENV || 'не установлен'
    }
    
    console.log('📋 Переменные окружения:', envCheck)
    
    // Проверяем подключение к Supabase
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Подключение к Supabase успешно')
    console.log('📊 Количество пользователей в БД:', data?.length || 0)
    
    // Проверяем структуру таблицы
    const { data: sampleUser } = await supabase
      .from('users')
      .select('id,email,name,subscriptionStatus,createdAt')
      .limit(1)
      .single()
    
    return NextResponse.json({
      status: 'OK',
      message: 'Supabase работает',
      environment: envCheck,
      database: {
        connected: true,
        userCount: data?.length || 0,
        sampleUser: sampleUser || 'Нет пользователей',
        tableExists: !error
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Ошибка подключения к Supabase:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Ошибка подключения к Supabase',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден',
        JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
        NODE_ENV: process.env.NODE_ENV || 'не установлен'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Тестируем регистрацию в Supabase...')
    
    const { email, password, name } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Тестируем создание пользователя
    const testUser = {
      id: crypto.randomUUID(),
      email: email + '_test',
      password: 'test_password',
      name: name || 'Test User',
      subscriptionStatus: 'FREE',
      usageCountDay: 0,
      usageCountMonth: 0,
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select('id,email,name,subscriptionStatus')
      .single()
    
    if (error) {
      throw error
    }
    
    // Удаляем тестового пользователя
    await supabase
      .from('users')
      .delete()
      .eq('id', data.id)
    
    return NextResponse.json({
      message: 'Тест регистрации прошел успешно',
      testUser: data
    })
    
  } catch (error) {
    console.error('❌ Ошибка теста регистрации:', error)
    
    return NextResponse.json({
      error: 'Ошибка теста регистрации',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
