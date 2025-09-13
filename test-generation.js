const http = require('http');

// Тест API генерации
function testGenerationAPI() {
  console.log('🧪 Тестируем API генерации...');
  
  const postData = JSON.stringify({
    prompt: 'Создай пост для ВКонтакте про кофейню',
    templateType: 'VK_POST'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Статус ответа: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Ответ API:', JSON.stringify(response, null, 2));
        
        if (response.text) {
          console.log('🎉 Генерация работает! Длина текста:', response.text.length);
        } else {
          console.log('❌ Текст не сгенерирован');
        }
      } catch (error) {
        console.log('❌ Ошибка парсинга ответа:', error.message);
        console.log('📄 Сырой ответ:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Ошибка запроса:', error.message);
    console.log('💡 Убедитесь, что сервер запущен: npm run dev');
  });

  req.write(postData);
  req.end();
}

// Тест статуса API
function testAPIStatus() {
  console.log('🔍 Проверяем статус API...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Статус API: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Статус API:', JSON.stringify(response, null, 2));
        
        // Если API работает, тестируем генерацию
        if (res.statusCode === 200) {
          console.log('\n🚀 API работает, тестируем генерацию...');
          setTimeout(testGenerationAPI, 1000);
        }
      } catch (error) {
        console.log('❌ Ошибка парсинга статуса:', error.message);
        console.log('📄 Сырой ответ:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ API недоступен:', error.message);
    console.log('💡 Запустите сервер: npm run dev');
  });

  req.end();
}

// Запускаем тесты
console.log('🚀 Начинаем тестирование генерации контента...\n');
testAPIStatus();