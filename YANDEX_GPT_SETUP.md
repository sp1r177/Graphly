# Настройка Yandex GPT 5.1 для Graphly

Это руководство поможет вам настроить Yandex GPT 5.1 в вашем проекте Graphly вместо Hugging Face API.

## 🚀 Быстрый старт

### 1. Получение API ключей Yandex Cloud

1. **Зарегистрируйтесь в Yandex Cloud**
   - Перейдите на [cloud.yandex.com](https://cloud.yandex.com)
   - Создайте аккаунт или войдите в существующий

2. **Создайте новый проект**
   - В консоли Yandex Cloud создайте новый проект
   - Запомните ID проекта (будет нужен как `YANDEX_FOLDER_ID`)

3. **Получите API ключ**
   - Перейдите в раздел "Сервисные аккаунты" в вашем проекте
   - Создайте новый сервисный аккаунт
   - Назначьте роли: `ai.languageModels.user` и `ai.languageModels.admin`
   - Создайте API ключ для сервисного аккаунта
   - Скопируйте ключ (это будет `YANDEX_API_KEY`)

4. **Включите Yandex GPT API**
   - В консоли перейдите в раздел "Yandex GPT"
   - Включите API для вашего проекта
   - Убедитесь, что у вас есть доступ к модели `yandexgpt`

### 2. Настройка переменных окружения

#### Локальная разработка

Создайте файл `.env.local` в корне проекта:

```bash
# Yandex Cloud API Configuration
YANDEX_API_KEY="your-yandex-api-key-here"
YANDEX_FOLDER_ID="your-yandex-folder-id-here"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/graphly"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

#### Production (Vercel)

1. **Добавьте переменные в Vercel Dashboard:**
   - Перейдите в настройки вашего проекта в Vercel
   - Откройте раздел "Environment Variables"
   - Добавьте следующие переменные:

   ```
   YANDEX_API_KEY = your-yandex-api-key-here
   YANDEX_FOLDER_ID = your-yandex-folder-id-here
   DATABASE_URL = your-production-database-url
   JWT_SECRET = your-production-jwt-secret
   NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app
   NODE_ENV = production
   ```

2. **Или используйте Vercel CLI:**
   ```bash
   vercel env add YANDEX_API_KEY
   vercel env add YANDEX_FOLDER_ID
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add NEXT_PUBLIC_BASE_URL
   ```

### 3. Тестирование локально

1. **Установите зависимости:**
   ```bash
   npm install
   ```

2. **Запустите в режиме разработки:**
   ```bash
   npm run dev
   # или
   vercel dev
   ```

3. **Проверьте API:**
   - Откройте `http://localhost:3000/api/generate` в браузере
   - Должны увидеть статус переменных окружения
   - Все переменные должны показывать "✅ Найден"

4. **Тестируйте генерацию:**
   - Перейдите на главную страницу
   - Введите текст для генерации
   - Выберите тип шаблона
   - Нажмите "Сгенерировать"
   - Проверьте консоль браузера и терминал для логов

### 4. Деплой на Vercel

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "Migrate from Hugging Face to Yandex GPT 5.1"
   git push origin main
   ```

2. **Vercel автоматически задеплоит изменения**

3. **Проверьте деплой:**
   - Откройте ваш сайт на Vercel
   - Проверьте `/api/generate` endpoint
   - Протестируйте генерацию контента

## 🔧 Устранение неполадок

### Проблемы с API ключами

**Ошибка 401: Неверный API ключ**
- Проверьте правильность `YANDEX_API_KEY`
- Убедитесь, что ключ не истек
- Проверьте, что сервисный аккаунт имеет нужные права

**Ошибка 403: Доступ запрещен**
- Проверьте `YANDEX_FOLDER_ID`
- Убедитесь, что API включен для проекта
- Проверьте права сервисного аккаунта

### Проблемы с лимитами

**Ошибка 429: Превышен лимит запросов**
- Yandex GPT имеет лимиты на количество запросов
- Подождите некоторое время перед повторным запросом
- Рассмотрите возможность обновления тарифа

### Проблемы с сетью

**Таймауты или ошибки сети**
- Проверьте стабильность интернет-соединения
- Убедитесь, что Vercel может обращаться к Yandex API
- Проверьте логи в Vercel Dashboard

## 📊 Мониторинг

### Логи в Vercel

1. **Откройте Vercel Dashboard**
2. **Перейдите в раздел "Functions"**
3. **Выберите функцию `/api/generate`**
4. **Просмотрите логи для отладки**

### Логи в браузере

Откройте Developer Tools (F12) и проверьте консоль для сообщений об ошибках.

## 🎯 Дополнительные настройки

### Настройка параметров генерации

В файле `src/app/api/generate/route.ts` вы можете настроить:

```typescript
const requestBody = {
  modelUri: `gpt://${yandexFolderId}/yandexgpt`,
  completionOptions: {
    stream: false,
    temperature: 0.7,    // Креативность (0.0 - 1.0)
    maxTokens: 2000      // Максимальная длина ответа
  },
  // ...
}
```

### Добавление новых типов контента

Добавьте новые типы в `systemPrompts`:

```typescript
const systemPrompts = {
  'VK_POST': '...',
  'TELEGRAM_POST': '...',
  'NEW_TYPE': 'Описание для нового типа контента...'
}
```

## 📝 Примечания

- Yandex GPT API работает только с сервисными аккаунтами
- API ключи имеют ограниченный срок действия
- Следите за лимитами использования в консоли Yandex Cloud
- Для production используйте отдельный проект Yandex Cloud

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены правильно
3. Проверьте статус Yandex Cloud API
4. Обратитесь к [документации Yandex Cloud](https://cloud.yandex.com/docs/ai/api-ref/llm/)
