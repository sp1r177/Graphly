import { NextRequest, NextResponse } from 'next/server'

const UNISENDER_API_KEY = process.env.UNISENDER_API_KEY
const UNISENDER_SENDER_EMAIL = process.env.UNISENDER_SENDER_EMAIL || 'noreply@yourdomain.com'

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationUrl, name } = await request.json()

    console.log('Send confirmation request:', {
      email,
      hasApiKey: !!UNISENDER_API_KEY,
      hasSenderEmail: !!UNISENDER_SENDER_EMAIL,
      confirmationUrl
    })

    if (!UNISENDER_API_KEY) {
      console.error('UniSender API key not found')
      return NextResponse.json({ error: 'UniSender not configured' }, { status: 500 })
    }

    // Красивый HTML шаблон письма
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Подтверждение регистрации</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
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
            <p>Если кнопка не работает, скопируйте эту ссылку в браузер:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${confirmationUrl}</p>
            <p>Ссылка действительна в течение 24 часов.</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Graphly</p>
            <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Отправка через UniSender API
    const response = await fetch('https://api.unisender.com/ru/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: UNISENDER_API_KEY,
        email: email,
        sender_name: 'Graphly',
        sender_email: UNISENDER_SENDER_EMAIL,
        subject: 'Подтверждение регистрации в Graphly',
        body: htmlTemplate,
        list_id: 1 // Можно настроить список в UniSender
      })
    })

    const result = await response.json()

    if (result.error) {
      console.error('UniSender error:', result.error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Confirmation email sent' })
  } catch (error) {
    console.error('Send confirmation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
