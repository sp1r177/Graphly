const { PrismaClient } = require('@prisma/client')

async function testDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Тестирование подключения к базе данных...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно!')
    
    // Проверяем, есть ли таблицы
    const userCount = await prisma.user.count()
    console.log(`📊 Пользователей в базе: ${userCount}`)
    
    const generationCount = await prisma.generation.count()
    console.log(`📊 Генераций в базе: ${generationCount}`)
    
    console.log('🎉 База данных работает корректно!')
    
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:')
    console.error(error.message)
    
    if (error.message.includes('P1001')) {
      console.log('\n💡 Возможные решения:')
      console.log('1. Проверьте DATABASE_URL в переменных окружения')
      console.log('2. Убедитесь, что база данных Supabase доступна')
      console.log('3. Проверьте пароль базы данных')
    }
    
    if (error.message.includes('P2021')) {
      console.log('\n💡 Таблицы не найдены. Запустите:')
      console.log('npx prisma db push')
    }
    
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
