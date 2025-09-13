import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const UNISENDER_API_KEY = process.env.UNISENDER_API_KEY
const UNISENDER_SENDER_EMAIL = process.env.UNISENDER_SENDER_EMAIL || 'noreply@unisender.com'
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationUrl, name } = await request.json()

    if (!UNISENDER_API_KEY) {
      return NextResponse.json({ error: 'UNISENDER_API_KEY not set' }, { status: 500 })
    }

    // HTML шаблон письма
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Подтверждение регистрации</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Добро пожаловать в Graphly!</h1>
          </div>
          <div class="content">
            <h2>Привет${name ? `, ${name}` : ''}!</h2>
            <p>Спасибо за регистрацию в нашем сервисе генерации контента с помощью ИИ.</p>
            <p>Для завершения регистрации подтвердите ваш email адрес:</p>
            <div style="text-align: center;">
              <a href="${confirmationUrl}" class="button">✅ Подтвердить email</a>
            </div>
            <p>Если кнопка не работает, скопируйте эту ссылку:</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">${confirmationUrl}</p>
            <p>Ссылка действительна в течение 24 часов.</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Graphly</p>
          </div>
        </div>
      </body>
      </html>
    `

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    // Генерируем action_link (официальный линк подтверждения) через Admin API
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
    const redirectTo = `${siteUrl.replace(/\/$/, '')}/auth/callback`

    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo,
      },
    })

    if (linkError || !linkData?.action_link) {
      console.error('generateLink error:', linkError)
      return NextResponse.json({ error: 'Failed to generate confirmation link' }, { status: 500 })
    }

    const confirmationUrl = linkData.action_link

    // Отправка через UniSender API
    // Unisender ожидает x-www-form-urlencoded и параметр format=json
    const params = new URLSearchParams()
    params.set('api_key', UNISENDER_API_KEY)
    params.set('email', email)
    params.set('sender_name', 'Graphly')
    params.set('sender_email', UNISENDER_SENDER_EMAIL)
    params.set('subject', 'Подтверждение регистрации в Graphly')
    params.set('body', htmlTemplate.replace('${confirmationUrl}', confirmationUrl))
    // params.set('list_id', '1') // укажите при необходимости существующий список

    const response = await fetch('https://api.unisender.com/ru/api/sendEmail?format=json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    const result = await response.json()

    if (result.error) {
      console.error('UniSender error:', result.error)
      return NextResponse.json({ error: `UniSender error: ${result.error}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'Email sent successfully', result })
  } catch (error) {
    console.error('Send confirmation error:', error)
    return NextResponse.json({ error: `Internal error: ${error}` }, { status: 500 })
  }
}
