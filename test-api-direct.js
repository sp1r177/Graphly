// Прямой тест API без браузера
const http = require('http');

console.log('🧪 Прямой тест API генерации...\n');

// Функция для отправки POST запроса
function testAPI() {
  const postData = JSON.stringify({
    prompt: 'Тестовое сообщение',
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

  console.log('📤 Отправка запроса на:', `http://${options.hostname}:${options.port}${options.path}`);
  console.log('📝 Данные:', postData);
  console.log();

  const req = http.request(options, (res) => {
    console.log('📡 Статус ответа:', res.statusCode);
    console.log('📡 Заголовки:', JSON.stringify(res.headers, null, 2));

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📄 Тело ответа:');
      try {
        const parsed = JSON.parse(data);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('❌ Не удалось распарсить JSON:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Ошибка запроса:', e.message);
    console.log('\n💡 Возможные причины:');
    console.log('1. Сервер не запущен (npm run dev)');
    console.log('2. Неправильный порт (должен быть 3000)');
    console.log('3. Ошибка в API роуте');
    console.log('4. Проблема с переменными окружения');
  });

  req.write(postData);
  req.end();
}

// Тест GET запроса к API статусу
function testAPIStatus() {
  console.log('🔍 Проверка статуса API...\n');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('📡 Статус ответа:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('📊 Статус переменных окружения:');
        if (parsed.environment) {
          Object.entries(parsed.environment).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
          });
        }
        console.log('\n✅ API статус работает!\n');
        // Теперь тестируем генерацию
        setTimeout(testAPI, 1000);
      } catch (e) {
        console.log('❌ Ошибка парсинга статуса:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Сервер не доступен:', e.message);
    console.log('\n🚨 СЕРВЕР НЕ ЗАПУЩЕН!');
    console.log('Запустите: npm run dev');
  });

  req.end();
}

// Запускаем тестирование
testAPIStatus();
