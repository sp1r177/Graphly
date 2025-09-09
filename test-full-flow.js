// Тест полного цикла: регистрация + генерация
console.log('🔄 ТЕСТ ПОЛНОГО ЦИКЛА: РЕГИСТРАЦИЯ + ГЕНЕРАЦИЯ\n');

// Функция для тестирования регистрации
async function testRegistration() {
  console.log('📝 Тестирование регистрации...');

  const testUser = {
    email: 'test' + Date.now() + '@example.com',
    password: 'Test123456',
    name: 'Test User'
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    console.log('📡 Статус регистрации:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Регистрация успешна!');
      console.log('👤 Пользователь:', data.user.email);
      return data.user;
    } else {
      const error = await response.json();
      console.log('❌ Ошибка регистрации:', error.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Ошибка сети при регистрации:', error.message);
    return null;
  }
}

// Функция для тестирования генерации
async function testGeneration() {
  console.log('\n🤖 Тестирование генерации контента...');

  const testData = {
    prompt: 'Создай пост для ВКонтакте о новом продукте',
    templateType: 'VK_POST'
  };

  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📡 Статус генерации:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Генерация успешна!');
      console.log('📝 Сгенерированный текст (первые 100 символов):');
      console.log(data.text?.substring(0, 100) + '...');

      if (data.debug) {
        console.log('🐛 Отладочная информация:');
        console.log('- Длина промпта:', data.debug.promptLength);
        console.log('- Длина текста:', data.debug.textLength);
        console.log('- Dev режим:', data.debug.isDev);
        console.log('- Авторизация:', data.debug.hasAuth ? '✅' : '❌');
      }

      return data;
    } else {
      const error = await response.json();
      console.log('❌ Ошибка генерации:', error.error);
      if (error.details) {
        console.log('📋 Детали:', error.details);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Ошибка сети при генерации:', error.message);
    return null;
  }
}

// Функция для тестирования статуса API
async function testAPIStatus() {
  console.log('\n🔍 Проверка статуса API...\n');

  try {
    const response = await fetch('http://localhost:3000/api/generate');
    const data = await response.json();

    console.log('📡 Статус ответа:', response.status);

    if (response.ok && data.status === 'OK') {
      console.log('✅ API работает!');
      console.log('\n🔧 Переменные окружения:');
      Object.entries(data.environment).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });

      const criticalVars = ['DATABASE_URL', 'JWT_SECRET'];
      const missing = criticalVars.filter(key => data.environment[key] === '❌ Не найден');

      if (missing.length > 0) {
        console.log('\n⚠️  Отсутствуют критические переменные:', missing.join(', '));
        console.log('Это может вызвать проблемы с авторизацией!');
      } else {
        console.log('\n✅ Все критические переменные настроены');
      }

      return true;
    } else {
      console.log('❌ API не работает:', data.message || 'Неизвестная ошибка');
      return false;
    }
  } catch (error) {
    console.error('❌ Сервер не доступен:', error.message);
    console.log('\n💡 Проверьте:');
    console.log('1. Запущен ли сервер: npm run dev');
    console.log('2. Доступен ли порт 3000');
    console.log('3. Правильно ли настроены переменные окружения');
    return false;
  }
}

// Основная функция тестирования
async function runFullTest() {
  console.log('🚀 ЗАПУСК ПОЛНОГО ТЕСТИРОВАНИЯ СИСТЕМЫ\n');
  console.log('=' .repeat(50));

  // Шаг 1: Проверка статуса API
  const apiOk = await testAPIStatus();

  if (!apiOk) {
    console.log('\n❌ API не работает! Прерываем тестирование.');
    console.log('Запустите сервер: npm run dev');
    return;
  }

  // Шаг 2: Тестирование регистрации
  const user = await testRegistration();

  if (!user) {
    console.log('\n⚠️  Регистрация не работает, но продолжаем тестирование генерации...');
  }

  // Шаг 3: Тестирование генерации
  const generation = await testGeneration();

  // Итоговый отчет
  console.log('\n' + '=' .repeat(50));
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ:');

  if (apiOk) {
    console.log('✅ API статус: работает');
  }

  if (user) {
    console.log('✅ Регистрация: работает');
  } else {
    console.log('❌ Регистрация: не работает');
  }

  if (generation && generation.text) {
    console.log('✅ Генерация: работает');
  } else {
    console.log('❌ Генерация: не работает');
  }

  console.log('\n🎯 РЕЗУЛЬТАТ:');
  if (generation && generation.text) {
    console.log('🎉 СИСТЕМА РАБОТАЕТ! Генерация контента функционирует.');
  } else {
    console.log('❌ СИСТЕМА НЕ РАБОТАЕТ. Проверьте логи выше.');
  }

  console.log('\n💡 ДАЛЬНЕЙШИЕ ШАГИ:');
  console.log('1. Если генерация работает - поздравляем! 🎉');
  console.log('2. Если нет - проверьте логи сервера в терминале');
  console.log('3. Откройте консоль браузера (F12) для дополнительных ошибок');
  console.log('4. Попробуйте перезапустить сервер: Ctrl+C, затем npm run dev');
}

// Запуск тестирования
runFullTest().catch(error => {
  console.error('💥 Критическая ошибка при тестировании:', error);
});
