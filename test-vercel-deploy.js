// Тест для проверки деплоя на Vercel
// Запустите: node test-vercel-deploy.js

const https = require('https');

const testUrl = 'https://your-domain.vercel.app/api/generate';

console.log('🧪 Тестирование Vercel деплоя...');
console.log('URL:', testUrl);

const req = https.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ API работает!');
      console.log('Статус:', response.status);
      console.log('Переменные окружения:');
      Object.entries(response.environment).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
      
      // Проверяем критически важные переменные
      const criticalVars = ['YANDEX_API_KEY', 'YANDEX_FOLDER_ID', 'DATABASE_URL', 'JWT_SECRET'];
      const missingVars = criticalVars.filter(varName => 
        response.environment[varName] === '❌ Не найден'
      );
      
      if (missingVars.length > 0) {
        console.log('❌ Отсутствуют переменные:', missingVars.join(', '));
        console.log('Добавьте их в Vercel Dashboard → Settings → Environment Variables');
      } else {
        console.log('🎉 Все переменные настроены правильно!');
      }
      
    } catch (error) {
      console.error('❌ Ошибка парсинга ответа:', error.message);
      console.log('Ответ сервера:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Ошибка запроса:', error.message);
  console.log('Проверьте URL и доступность сайта');
});

req.setTimeout(10000, () => {
  console.error('❌ Таймаут запроса');
  req.destroy();
});
