import { NextRequest, NextResponse } from 'next/server'

// Конфигурация Яндекс.Касса (в продакшене вынести в переменные окружения)
const YANDEX_KASSA_CONFIG = {
  shopId: process.env.YANDEX_KASSA_SHOP_ID || 'your_shop_id',
  secretKey: process.env.YANDEX_KASSA_SECRET_KEY || 'your_secret_key',
  baseUrl: process.env.YANDEX_KASSA_BASE_URL || 'https://payment.yandex.net/api/v3'
}

export async function POST(request: NextRequest) {
  try {
    const { planId, amount, currency = 'RUB' } = await request.json()

    if (!planId || !amount) {
      return NextResponse.json(
        { error: 'Plan ID and amount are required' },
        { status: 400 }
      )
    }

    // Определяем описание плана
    const planDescriptions = {
      'start': 'План Старт - 100 генераций в месяц',
      'business': 'План Бизнес - 500 генераций в месяц'
    }

    const description = planDescriptions[planId as keyof typeof planDescriptions] || 'Подписка на платформу'

    // Создаем платеж в Яндекс.Касса
    const paymentData = {
      amount: {
        value: amount.toString(),
        currency: currency
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?payment=success`
      },
      capture: true,
      description: description,
      receipt: {
        customer: {
          email: 'customer@example.com' // В продакшене брать из аутентификации
        },
        items: [
          {
            description: description,
            amount: {
              value: amount.toString(),
              currency: currency
            },
            vat_code: 1,
            quantity: '1'
          }
        ]
      }
    }

    // В продакшене здесь будет реальный запрос к API Яндекс.Касса
    // const response = await fetch(`${YANDEX_KASSA_CONFIG.baseUrl}/payments`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${Buffer.from(YANDEX_KASSA_CONFIG.shopId + ':' + YANDEX_KASSA_CONFIG.secretKey).toString('base64')}`,
    //     'Content-Type': 'application/json',
    //     'Idempotence-Key': generateIdempotenceKey()
    //   },
    //   body: JSON.stringify(paymentData)
    // })

    // Пока возвращаем заглушку для демонстрации
    const mockPaymentUrl = `/api/payments/mock-payment?planId=${planId}&amount=${amount}`
    
    // Сохраняем информацию о платеже в базу данных (в продакшене)
    // await prisma.payment.create({
    //   data: {
    //     userId: 'user_id', // Получать из аутентификации
    //     planId,
    //     amount,
    //     currency,
    //     status: 'PENDING',
    //     paymentId: 'mock_payment_id'
    //   }
    // })

    return NextResponse.json({
      success: true,
      paymentUrl: mockPaymentUrl,
      paymentId: `mock_${Date.now()}`,
      message: 'Платеж создан успешно'
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// Генерируем уникальный ключ для идемпотентности
function generateIdempotenceKey(): string {
  return `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}