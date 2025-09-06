// Диагностика приложения
console.log('🔍 Диагностика приложения AIКонтент')
console.log('=====================================')

// Проверяем переменные окружения
console.log('\n📋 Переменные окружения:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Настроен' : '❌ Не найден')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Настроен' : '❌ Не найден')
console.log('YANDEX_GPT_API_KEY:', process.env.YANDEX_GPT_API_KEY ? '✅ Настроен' : '❌ Не найден')
console.log('NODE_ENV:', process.env.NODE_ENV || 'не установлен')

// Проверяем файлы
const fs = require('fs')
const path = require('path')

console.log('\n📁 Файлы конфигурации:')
console.log('.env:', fs.existsSync('.env') ? '✅ Найден' : '❌ Не найден')
console.log('.env.local:', fs.existsSync('.env.local') ? '✅ Найден' : '❌ Не найден')
console.log('prisma/schema.prisma:', fs.existsSync('prisma/schema.prisma') ? '✅ Найден' : '❌ Не найден')

// Проверяем Prisma
console.log('\n🔧 Prisma:')
try {
  const { PrismaClient } = require('@prisma/client')
  console.log('✅ Prisma клиент загружен')
  
  const prisma = new PrismaClient()
  console.log('✅ Prisma клиент создан')
  
  // Тестируем подключение
  prisma.$connect()
    .then(() => {
      console.log('✅ Подключение к базе данных успешно')
      return prisma.$disconnect()
    })
    .catch((error) => {
      console.log('❌ Ошибка подключения к базе данных:', error.message)
    })
    
} catch (error) {
  console.log('❌ Ошибка загрузки Prisma:', error.message)
}

console.log('\n💡 Рекомендации:')
console.log('1. Создайте файл .env.local с переменными окружения')
console.log('2. Получите пароль БД из Supabase')
console.log('3. Запустите: npx prisma db push')
console.log('4. Запустите: npm run dev')
