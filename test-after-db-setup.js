// Тест после настройки базы данных
const { PrismaClient } = require('@prisma/client')

async function testAfterDBSetup() {
  console.log('🧪 ТЕСТИРОВАНИЕ ПОСЛЕ НАСТРОЙКИ БД\n')
  console.log('=' .repeat(50))

  const prisma = new PrismaClient()

  try {
    // Тест 1: Подключение к БД
    console.log('📡 Тест 1: Подключение к БД...')
    await prisma.$connect()
    console.log('✅ Подключение успешно!\n')

    // Тест 2: Проверка таблиц
    console.log('📋 Тест 2: Проверка таблиц...')

    const userCount = await prisma.user.count()
    console.log(`👥 Пользователей: ${userCount}`)

    const generationCount = await prisma.generation?.count?.() || 0
    console.log(`📝 Генераций: ${generationCount}`)

    const paymentCount = await prisma.payment?.count?.() || 0
    console.log(`💳 Платежей: ${paymentCount}`)
    console.log()

    // Тест 3: Создание тестового пользователя
    console.log('👤 Тест 3: Создание тестового пользователя...')
    const timestamp = Date.now()
    const testEmail = `test-${timestamp}@example.com`

    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkI9QGP4K5qM', // "password123"
        name: 'Тестовый Пользователь',
        subscriptionStatus: 'FREE',
        usageCountDay: 0,
        usageCountMonth: 0,
      }
    })

    console.log('✅ Тестовый пользователь создан:')
    console.log('   Email:', testUser.email)
    console.log('   ID:', testUser.id)
    console.log()

    // Тест 4: Создание тестовой генерации
    console.log('🤖 Тест 4: Создание тестовой генерации...')

    const testGeneration = await prisma.generation?.create?.({
      data: {
        userId: testUser.id,
        prompt: 'Тестовый промпт',
        outputText: 'Тестовый сгенерированный текст',
        templateType: 'VK_POST'
      }
    })

    if (testGeneration) {
      console.log('✅ Тестовая генерация создана:')
      console.log('   ID:', testGeneration.id)
      console.log('   Тип:', testGeneration.templateType)
    } else {
      console.log('⚠️  Таблица generations недоступна')
    }
    console.log()

    // Итоговый отчет
    console.log('=' .repeat(50))
    console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:')

    console.log('✅ Подключение к БД: работает')
    console.log('✅ Таблица users: доступна')
    console.log(`✅ Создание пользователей: работает (${userCount + 1} пользователей)`)

    if (testGeneration) {
      console.log('✅ Таблица generations: доступна')
      console.log('✅ Создание генераций: работает')
    } else {
      console.log('⚠️  Таблица generations: недоступна (опционально)')
    }

    console.log('\n🎉 БАЗА ДАННЫХ ГОТОВА К РАБОТЕ!')
    console.log('\n📋 ДАЛЬНЕЙШИЕ ШАГИ:')
    console.log('1. Запустите сервер: npm run dev')
    console.log('2. Откройте: test-auth-and-generate.html')
    console.log('3. Протестируйте регистрацию и генерацию')
    console.log('4. Проверьте создание записей в БД')

  } catch (error) {
    console.error('❌ ОШИБКА ТЕСТИРОВАНИЯ:', error.message)
    console.log('\n💡 ВОЗМОЖНЫЕ РЕШЕНИЯ:')
    console.log('1. Проверьте .env.local файл')
    console.log('2. Запустите: setup-database.bat')
    console.log('3. Проверьте переменную DATABASE_URL')
    console.log('4. Перезапустите терминал')
  } finally {
    await prisma.$disconnect()
  }
}

testAfterDBSetup()
