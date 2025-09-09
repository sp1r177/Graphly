// Проверка статуса базы данных и создание тестового пользователя
const { PrismaClient } = require('@prisma/client')

async function checkDatabase() {
  console.log('🔍 Проверка статуса базы данных...\n')

  const prisma = new PrismaClient()

  try {
    // Проверяем подключение
    console.log('📡 Проверка подключения к БД...')
    await prisma.$connect()
    console.log('✅ Подключение к БД успешно!\n')

    // Проверяем таблицы
    console.log('📋 Проверка таблиц...')

    // Проверяем пользователей
    const userCount = await prisma.user.count()
    console.log(`👥 Пользователей в БД: ${userCount}`)

    if (userCount === 0) {
      console.log('\n🆕 Создание тестового пользователя...')

      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkI9QGP4K5qM', // "password123"
          name: 'Тестовый Пользователь',
          subscriptionStatus: 'FREE',
          usageCountDay: 0,
          usageCountMonth: 0,
        }
      })

      console.log('✅ Тестовый пользователь создан:')
      console.log('   Email:', testUser.email)
      console.log('   Имя:', testUser.name)
      console.log('   ID:', testUser.id)
    }

    // Проверяем генерации
    const generationCount = await prisma.generation?.count() || 0
    console.log(`📝 Генераций в БД: ${generationCount}`)

    console.log('\n🎉 База данных работает корректно!')

  } catch (error) {
    console.error('❌ Ошибка работы с БД:', error.message)
    console.log('\n💡 Возможные решения:')
    console.log('1. Проверьте .env.local файл')
    console.log('2. Запустите: npx prisma db push')
    console.log('3. Проверьте переменную DATABASE_URL')
    console.log('4. Перезапустите сервер')
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
