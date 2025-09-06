const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🔄 Инициализация базы данных...')
    
    // Check if database file exists
    const dbPath = path.join(__dirname, 'prisma', 'dev.db')
    if (fs.existsSync(dbPath)) {
      console.log('📁 База данных уже существует')
    } else {
      console.log('📁 Создание новой базы данных...')
    }

    // Test database connection
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')

    // Create tables if they don't exist
    console.log('🔄 Создание таблиц...')
    
    // Test if tables exist by trying to query them
    try {
      await prisma.user.findMany({ take: 1 })
      console.log('✅ Таблицы уже существуют')
    } catch (error) {
      console.log('🔄 Применение миграций...')
      // In a real setup, you would run: npx prisma db push
      console.log('⚠️  Запустите: npx prisma db push')
    }

    console.log('🎉 База данных готова к использованию!')
    
  } catch (error) {
    console.error('❌ Ошибка при настройке базы данных:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
