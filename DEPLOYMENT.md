# 🚀 Развертывание AIКонтент на Vercel

Подробное руководство по развертыванию платформы генерации маркетингового контента на Vercel.

## 📋 Предварительные требования

### Системные требования
- Node.js 18.0.0 или выше
- npm 9.0.0 или выше
- Git
- Аккаунт на [vercel.com](https://vercel.com)

### Необходимые сервисы
- **База данных**: PostgreSQL (Vercel Postgres, Supabase, PlanetScale)
- **Платежи**: Яндекс.Касса (для продакшена)
- **AI API**: Hugging Face, OpenAI или аналоги

## 🔧 Подготовка проекта

### 1. Клонирование репозитория

```bash
git clone <your-repo-url>
cd Graphly
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Проверка работоспособности

```bash
npm run build
```

Убедитесь, что сборка проходит без ошибок.

## 🌍 Настройка переменных окружения

### Локальная разработка

Создайте файл `.env.local`:

```env
# База данных
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT секрет
JWT_SECRET="your-super-secret-jwt-key-here"

# Базовый URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Яндекс.Касса (для продакшена)
YANDEX_KASSA_SHOP_ID="your_shop_id"
YANDEX_KASSA_SECRET_KEY="your_secret_key"
YANDEX_KASSA_BASE_URL="https://payment.yandex.net/api/v3"

# AI API (опционально)
HUGGINGFACE_API_KEY="your_huggingface_api_key"
OPENAI_API_KEY="your_openai_api_key"
```

### Vercel переменные окружения

В Vercel Dashboard добавьте следующие переменные:

```env
# Обязательные
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your-super-secret-jwt-key-here"
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"

# Опциональные (для продакшена)
YANDEX_KASSA_SHOP_ID="your_shop_id"
YANDEX_KASSA_SECRET_KEY="your_secret_key"
YANDEX_KASSA_BASE_URL="https://payment.yandex.net/api/v3"
HUGGINGFACE_API_KEY="your_huggingface_api_key"
```

## 🗄️ Настройка базы данных

### Вариант 1: Vercel Postgres (рекомендуется)

1. В Vercel Dashboard перейдите в ваш проект
2. Нажмите "Storage" → "Connect Database"
3. Выберите "Postgres"
4. Следуйте инструкциям по настройке
5. Скопируйте `DATABASE_URL` в переменные окружения

### Вариант 2: Supabase

1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Перейдите в Settings → Database
4. Скопируйте Connection string
5. Обновите `DATABASE_URL` в Vercel

### Вариант 3: PlanetScale

1. Зарегистрируйтесь на [planetscale.com](https://planetscale.com)
2. Создайте новую базу данных
3. Получите Connection string
4. Обновите `DATABASE_URL` в Vercel

### Применение миграций

После настройки базы данных:

```bash
# Генерация Prisma Client
npx prisma generate

# Применение миграций
npx prisma migrate deploy
```

## 🚀 Деплой на Vercel

### Способ 1: Через Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Первый деплой
vercel

# Продакшн деплой
vercel --prod
```

### Способ 2: Через GitHub (рекомендуется)

1. **Загрузите код в GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Подключите к Vercel**
   - Перейдите на [vercel.com](https://vercel.com)
   - Нажмите "New Project"
   - Подключите ваш GitHub репозиторий
   - Выберите репозиторий `Graphly`

3. **Настройте проект**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (по умолчанию)
   - Build Command: `npm run build` (по умолчанию)
   - Output Directory: `.next` (по умолчанию)
   - Install Command: `npm install` (по умолчанию)

4. **Настройте переменные окружения**
   - В разделе "Environment Variables" добавьте все необходимые переменные
   - Убедитесь, что `DATABASE_URL` указан правильно

5. **Деплой**
   - Нажмите "Deploy"
   - Дождитесь завершения сборки

## ⚙️ Пост-деплой настройки

### 1. Проверка работоспособности

После успешного деплоя проверьте:

- [ ] Главная страница загружается
- [ ] Генератор контента работает
- [ ] Форма обратной связи отправляется
- [ ] Страница цен отображается корректно

### 2. Настройка базы данных

```bash
# Подключитесь к продакшн базе данных
npx prisma db push

# Или примените миграции
npx prisma migrate deploy
```

### 3. Проверка API endpoints

Протестируйте основные API:

```bash
# Генерация контента
curl -X POST https://your-domain.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Тест","templateType":"VK_POST"}'

# Форма обратной связи
curl -X POST https://your-domain.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест","email":"test@example.com","message":"Тест"}'
```

## 🔒 Настройка безопасности

### 1. HTTPS

Vercel автоматически предоставляет HTTPS сертификаты.

### 2. Заголовки безопасности

Создайте файл `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### 3. Rate Limiting

Для защиты от DDoS атак настройте rate limiting в Vercel:

```javascript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Простой rate limiting
  const ip = request.ip || 'unknown'
  const rateLimitKey = `rate_limit_${ip}`
  
  // Здесь можно добавить логику rate limiting
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

## 📊 Мониторинг и аналитика

### 1. Vercel Analytics

Включите Vercel Analytics в настройках проекта для отслеживания:

- Производительности
- Ошибок
- Использования ресурсов

### 2. Логирование

Настройте логирование ошибок:

```javascript
// lib/logger.ts
export const logger = {
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
    // Здесь можно добавить отправку в внешние сервисы
  },
  info: (message: string) => {
    console.log(`[INFO] ${message}`)
  }
}
```

### 3. Health Check

Создайте endpoint для проверки здоровья приложения:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Проверка базы данных
    // await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    )
  }
}
```

## 🚨 Устранение проблем

### Ошибка сборки

```bash
# Очистка кэша
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Ошибки базы данных

```bash
# Проверка подключения
npx prisma db pull

# Сброс базы данных (осторожно!)
npx prisma migrate reset
```

### Проблемы с переменными окружения

1. Проверьте правильность `DATABASE_URL`
2. Убедитесь, что все переменные добавлены в Vercel
3. Перезапустите деплой после изменения переменных

### Ошибки API

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что база данных доступна
3. Проверьте правильность JWT_SECRET

## 🔄 Обновления и деплой

### Автоматический деплой

При настройке через GitHub деплой происходит автоматически при каждом push в main ветку.

### Ручной деплой

```bash
# Обновление кода
git pull origin main

# Локальная проверка
npm run build

# Деплой на Vercel
vercel --prod
```

### Откат изменений

В Vercel Dashboard можно откатиться к предыдущей версии:

1. Перейдите в "Deployments"
2. Найдите стабильную версию
3. Нажмите "Redeploy"

## 📱 Домены и SSL

### Настройка кастомного домена

1. В Vercel Dashboard перейдите в "Settings" → "Domains"
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel
4. SSL сертификат будет выдан автоматически

### Поддомены

```bash
# Пример настройки поддомена
api.yourdomain.com -> API endpoints
app.yourdomain.com -> Основное приложение
```

## 💰 Оптимизация стоимости

### Vercel планы

- **Hobby**: Бесплатно (ограничения)
- **Pro**: $20/мес (больше функций)
- **Enterprise**: По запросу

### Оптимизация

1. Используйте кэширование
2. Оптимизируйте изображения
3. Минимизируйте размер бандла
4. Используйте CDN для статических файлов

## 📞 Поддержка

### Vercel поддержка

- [Документация Vercel](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

### AIКонтент поддержка

- Email: support@aikontent.ru
- Telegram: @aikontent_support
- Документация: [docs.aikontent.ru](https://docs.aikontent.ru)

---

**🎉 Поздравляем!** Ваша платформа AIКонтент успешно развернута на Vercel!

Теперь вы можете:
- Создавать контент с помощью ИИ
- Принимать платежи через Яндекс.Касса
- Масштабировать приложение по мере роста
- Получать аналитику и мониторинг

Удачи в развитии вашего проекта! 🚀