// Тест подключения к базе данных
const { PrismaClient } = require('@prisma/client')

async function testDatabaseConnection() {
  console.log('🔍 Тестирование подключения к базе данных...\n')

  // Проверяем переменные окружения
  console.log('📋 Переменные окружения:')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден')
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден')
  
  if (!process.env.DATABASE_URL) {
    console.log('\n❌ DATABASE_URL не найден!')
    console.log('💡 Решение:')
    console.log('1. Создайте .env.local файл')
    console.log('2. Добавьте DATABASE_URL для PostgreSQL или SQLite')
    console.log('3. Для Vercel: добавьте переменную в Dashboard')
    return
  }

  const prisma = new PrismaClient()

  try {
    console.log('\n📡 Попытка подключения к БД...')
    await prisma.$connect()
    console.log('✅ Подключение успешно!')

    console.log('\n📋 Проверка таблиц...')
    
    // Проверяем таблицу users
    try {
      const userCount = await prisma.user.count()
      console.log('✅ Таблица users доступна, пользователей:', userCount)
    } catch (error) {
      console.log('❌ Таблица users недоступна:', (error as Error).message)
      console.log('💡 Запустите: npx prisma db push')
    }

    // Тестируем создание пользователя
    console.log('\n👤 Тест создания пользователя...')
    try {
      const testEmail = 'test-' + Date.now() + '@example.com'
      const testUser = await prisma.user.create({
        data: {
          email: testEmail,
          password: '$2a$12$test.hash.password',
          name: 'Test User',
          subscriptionStatus: 'FREE',
          usageCountDay: 0,
          usageCountMonth: 0,
        }
      })

      console.log('✅ Тестовый пользователь создан:', testUser.email)
      
      // Удаляем тестового пользователя
      await prisma.user.delete({
        where: { id: testUser.id }
      })
      console.log('✅ Тестовый пользователь удален')

    } catch (error) {
      console.log('❌ Ошибка создания пользователя:', (error as Error).message)
    }

    console.log('\n🎉 База данных готова для регистрации!')

  } catch (error) {
    console.error('\n❌ Критическая ошибка БД:', (error as Error).message)
    console.log('\n💡 Возможные решения:')
    console.log('1. Проверьте DATABASE_URL')
    console.log('2. Убедитесь, что БД доступна')
    console.log('3. Запустите: npx prisma db push')
    console.log('4. Проверьте права доступа к БД')
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()
