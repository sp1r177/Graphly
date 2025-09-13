// Тест генерации контента
// Запустите: node test-generation.js

async function testGeneration() {
  console.log('🧪 Тестирование генерации контента...\n');

  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Создай пост для ВКонтакте о новом продукте',
        templateType: 'VK_POST'
      })
    });

    console.log('📡 Статус ответа:', response.status);
    console.log('📡 Заголовки:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('📄 Данные ответа:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.log('❌ Ошибка:', data.error);
    } else {
      console.log('✅ Генерация успешна!');
      console.log('📝 Сгенерированный текст:', data.text?.substring(0, 100) + '...');
    }

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    console.log('\n💡 Возможные причины:');
    console.log('1. Сервер не запущен (npm run dev)');
    console.log('2. Проблема с переменными окружения');
    console.log('3. Ошибка в коде API роута');
    console.log('4. Проблема с базой данных');
  }
}

testGeneration();
