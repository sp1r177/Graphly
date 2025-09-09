// Простой тест генерации
console.log('🧪 Запуск простого теста генерации...\n');

// Имитируем запрос к API
const testData = {
  prompt: 'Создай пост для ВКонтакте о новом продукте',
  templateType: 'VK_POST'
};

console.log('📤 Отправляем тестовый запрос:');
console.log(JSON.stringify(testData, null, 2));
console.log();

// Имитируем ответ API
const mockResponse = {
  id: 'test-123',
  text: '📱 Пост для ВКонтакте:\n\nПредставляем наш новый продукт! 🚀\n\nЭто инновационное решение поможет вам достичь новых высот в вашем бизнесе.\n\n#новыйпродукт #инновации #бизнес',
  templateType: 'VK_POST',
  timestamp: new Date().toISOString(),
  debug: {
    promptLength: testData.prompt.length,
    textLength: 120,
    isDev: true,
    hasAuth: true
  }
};

console.log('📥 Имитируем ответ API:');
console.log(JSON.stringify(mockResponse, null, 2));
console.log();

console.log('✅ Тест завершен успешно!');
console.log('💡 Если в браузере генерация не работает:');
console.log('   1. Проверьте консоль браузера (F12)');
console.log('   2. Проверьте логи сервера (npm run dev)');
console.log('   3. Убедитесь, что сервер запущен');
console.log('   4. Проверьте переменные окружения');
