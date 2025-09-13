import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Находим пользователя по email
    const { data: users, error: findError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .limit(1)

    if (findError || !users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users[0]

    // Обновляем статус подтверждения email
    const { error: updateError } = await supabase
      .from('auth.users')
      .update({ 
        email_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to confirm email' }, { status: 500 })
    }

    // Создаем сессию для пользователя
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: 'temp' // Временный пароль для создания сессии
    })

    if (sessionError) {
      console.error('Session error:', sessionError)
    }

    const response = NextResponse.json({ message: 'Email confirmed successfully' })

    // Устанавливаем cookie с токеном
    if (sessionData?.session?.access_token) {
      response.cookies.set('sb-access-token', sessionData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return response
  } catch (error) {
    console.error('Confirm email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
