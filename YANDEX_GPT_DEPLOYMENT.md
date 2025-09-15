# Развертывание Yandex GPT 5.1 Pro

## Шаги для запуска

### 1. Установка зависимостей
```bash
npm install
# Устанавливает только axios для работы с Yandex GPT API
```

### 2. Настройка переменных окружения
Создайте файл `.env.local` с переменными:
```env
# Yandex GPT 5.1 Pro
YANDEX_GPT_API_KEY="your-yandex-gpt-api-key"
YANDEX_GPT_FOLDER_ID="your-yandex-cloud-folder-id"
YANDEX_GPT_ASYNC_MODE="true"  # true = асинхронный (0.20₽/1k токенов), false = синхронный (0.40₽/1k токенов)
```

### 3. Миграция базы данных
```bash
# Создание миграции
npx prisma migrate dev --name add-token-tracking

# Генерация Prisma клиента
npx prisma generate

# Запуск миграции для существующих данных
node migrate-tokens.js
```

### 4. Запуск приложения
```bash
npm run dev
```

## Проверка работы

### 1. Проверка здоровья API
```bash
curl http://localhost:3000/api/yandex-gpt/health
```

### 2. Тест генерации контента
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "Создай пост о новом продукте",
    "templateType": "VK_POST"
  }'
```

### 3. Проверка статистики токенов
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/user/token-usage
```

## Мониторинг

### Логи
- Ошибки Yandex GPT API логируются в консоль
- Fallback генерация активируется при ошибках API
- Статистика токенов сохраняется в базе данных

### Метрики
- Количество использованных токенов
- Количество генераций
- Оставшиеся лимиты
- Статус подписки пользователя

## Безопасность

### API ключи
- Храните API ключи в переменных окружения
- Не коммитьте `.env.local` в репозиторий
- Используйте разные ключи для dev/prod

### Лимиты
- Система автоматически проверяет лимиты
- Превышение лимитов блокирует генерацию
- Fallback генерация работает при ошибках API

## Масштабирование

### Производительность
- Yandex GPT API имеет свои лимиты запросов
- Реализован fallback для отказоустойчивости
- Кэширование результатов не реализовано (можно добавить)

### Мониторинг расходов
- Отслеживайте использование в Yandex Cloud Console
- Настройте алерты при превышении бюджета
- Мониторьте статистику токенов в приложении

## Поддержка

### Частые проблемы
1. **API ключ не работает** - проверьте правильность ключа и folder ID
2. **Превышение лимитов** - проверьте лимиты в Yandex Cloud
3. **Fallback генерация** - проверьте логи для диагностики

### Контакты
- Yandex Cloud Support: https://cloud.yandex.ru/support
- Документация API: https://cloud.yandex.ru/docs/foundation-models/
