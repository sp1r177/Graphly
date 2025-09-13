import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Формируем абсолютный URL редиректа для письма
    const origin = request.headers.get('origin') || process.env.SITE_URL || 'http://localhost:3000'
    const redirectTo = `${origin.replace(/\/$/, '')}/auth/callback`

    // Требуется серверный ключ для генерации ссылки подтверждения
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.SUPABASE_URL
    if (!serviceKey || !supabaseUrl) {
      return NextResponse.json(
        { error: 'Server auth is not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)' },
        { status: 500 }
      )
    }

    const admin = createClient(supabaseUrl, serviceKey)

    // Генерируем ссылку подтверждения, создавая/обновляя пользователя
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        data: { name: name || '' },
        redirectTo,
      },
    })

    if (linkError || !linkData?.action_link) {
      console.error('generateLink error:', linkError)
      return NextResponse.json({ error: 'Failed to generate confirmation link' }, { status: 500 })
    }

    const actionLink = linkData.action_link

    // Отправляем письмо через UniSender API с action_link
    const UNISENDER_API_KEY = process.env.UNISENDER_API_KEY
    const UNISENDER_SENDER_EMAIL = process.env.UNISENDER_SENDER_EMAIL || 'noreply@unisender.com'
    if (!UNISENDER_API_KEY) {
      return NextResponse.json({ error: 'UNISENDER_API_KEY not set' }, { status: 500 })
    }

    const htmlTemplate = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Подтверждение регистрации</title></head><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0"><div style="max-width:600px;margin:0 auto;background:#fff"><div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:28px 30px;text-align:center"><h1 style="margin:0;font-size:22px">🎉 Добро пожаловать в Graphly!</h1></div><div style="padding:28px 30px"><p style="margin:0 0 12px 0">Привет${name ? `, ${name}` : ''}!</p><p style="margin:0 0 12px 0">Для завершения регистрации подтвердите ваш email:</p><div style="text-align:center;margin:22px 0"><a href="${actionLink}" style="display:inline-block;background:#667eea;color:#fff;padding:14px 22px;border-radius:6px;text-decoration:none">✅ Подтвердить email</a></div><p style="margin:0 0 8px 0">Если кнопка не работает, скопируйте ссылку ниже:</p><p style="word-break:break-all;background:#f5f5f5;padding:10px;border-radius:6px">${actionLink}</p><p style="margin-top:18px;color:#666;font-size:14px">С уважением, команда Graphly</p></div></div></body></html>`

    // Отправляем письмо через UniSender API с action_link
    const params = new URLSearchParams()
    params.set('api_key', UNISENDER_API_KEY)
    params.set('email', email)
    params.set('sender_name', 'Graphly')
    params.set('sender_email', UNISENDER_SENDER_EMAIL)
    params.set('subject', 'Подтверждение регистрации в Graphly')
    params.set('body', htmlTemplate)
    params.set('body_type', 'html')

    const uniResp = await fetch('https://api.unisender.com/ru/api/sendEmail?format=json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    const uniJson = await uniResp.json().catch(() => ({}))
    if (!uniResp.ok || (uniJson?.error && !uniJson?.result)) {
      console.error('UniSender sendEmail error:', uniJson)
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email to confirm your account.',
      needsEmailConfirmation: true,
      user: { email },
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