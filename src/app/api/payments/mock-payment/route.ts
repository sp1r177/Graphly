import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const planId = searchParams.get('planId')
  const amount = searchParams.get('amount')

  // В продакшене здесь будет реальная страница оплаты Яндекс.Касса
  const html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Демо-платеж - AIКонтент</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">Демо-платеж</h1>
                <p class="text-gray-600">Это демонстрационная страница платежа</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-gray-700">План:</span>
                    <span class="font-semibold text-gray-900">${planId === 'start' ? 'Старт' : 'Бизнес'}</span>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-gray-700">Сумма:</span>
                    <span class="font-semibold text-gray-900">${amount} ₽</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-700">Период:</span>
                    <span class="font-semibold text-gray-900">1 месяц</span>
                </div>
            </div>

            <div class="space-y-4">
                <button 
                    onclick="simulatePayment()"
                    class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Оплатить ${amount} ₽
                </button>
                
                <button 
                    onclick="window.close()"
                    class="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                    Отмена
                </button>
            </div>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-500">
                    В продакшене здесь будет реальная страница оплаты Яндекс.Касса
                </p>
            </div>
        </div>

        <script>
            function simulatePayment() {
                // Симулируем успешный платеж
                const button = event.target;
                button.disabled = true;
                button.textContent = 'Обрабатываем...';
                button.classList.add('opacity-50');

                setTimeout(() => {
                    // Перенаправляем на страницу успеха
                    window.location.href = '/dashboard?payment=success&planId=${planId}&amount=${amount}';
                }, 2000);
            }
        </script>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
