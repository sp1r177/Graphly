# 🚀 Настройка генерации контента с Supabase

## ❌ ОШИБКА ИСПРАВЛЕНА!
Я случайно настроил SQLite вместо Supabase. Теперь исправляем!

## 🎯 Что нужно сделать:

### ШАГ 1: Настройка .env.local
Создайте файл `.env.local` с содержимым:
```env
# Supabase PostgreSQL Database
DATABASE_URL="postgresql://postgres:[ПАРОЛЬ]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres"

# JWT Secret for authentication
JWT_SECRET="super-secret-jwt-key-change-this-in-production-12345"

# Yandex Cloud API Configuration (оставьте пустыми, если нет ключей)
YANDEX_API_KEY=""
YANDEX_FOLDER_ID=""

# Supabase Configuration (опционально)
SUPABASE_URL="https://mpsrlymennzlzoogkpvc.supabase.co"
SUPABASE_ANON_KEY=""

# Next.js Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### ШАГ 2: Получите пароль от Supabase
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите проект `mpsrlymennzlzoogkpvc`
3. Перейдите в **Settings → Database**
4. Скопируйте **Database Password** или создайте новый
5. Замените `[ПАРОЛЬ]` в `DATABASE_URL`

### ШАГ 3: Создайте таблицы в Supabase
Откройте **SQL Editor** в Supabase и выполните:

```sql
-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  "subscriptionStatus" TEXT DEFAULT 'FREE',
  "usageCountDay" INTEGER DEFAULT 0,
  "usageCountMonth" INTEGER DEFAULT 0,
  "lastGenerationDate" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Создание таблицы генераций
CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  prompt TEXT NOT NULL,
  "outputText" TEXT,
  "outputImageUrl" TEXT,
  "templateType" TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Создание таблицы платежей
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT DEFAULT 'PENDING',
  "yandexPaymentId" TEXT,
  "subscriptionType" TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);
```

### ШАГ 4: Генерация Prisma клиента
```bash
npx prisma generate
```

### ШАГ 5: Запуск сервера
```bash
npm run dev
```

## 🧪 Тестирование

### Проверка API:
Откройте `http://localhost:3000/api/generate`

**Ожидаемый ответ:**
```json
{
  "status": "OK",
  "message": "Generate API работает",
  "environment": {
    "DATABASE_URL": "✅ Найден",
    "JWT_SECRET": "✅ Найден",
    "YANDEX_API_KEY": "❌ Не найден",
    "YANDEX_FOLDER_ID": "❌ Не найден"
  }
}
```

### Тестирование генерации:
1. Откройте `http://localhost:3000`
2. Введите текст для генерации
3. Выберите тип контента
4. Нажмите "Сгенерировать"

## 🎉 Что будет работать:

✅ **Генерация контента** - через Yandex GPT или мок-данные  
✅ **Сохранение в Supabase** - все генерации сохраняются в PostgreSQL  
✅ **Авторизация** - работает через JWT  
✅ **Лимиты** - для бесплатных пользователей (10 генераций/день)  

## 🐛 Если что-то не работает:

### ❌ "Database connection failed"
- Проверьте `DATABASE_URL` в `.env.local`
- Убедитесь, что пароль правильный
- Проверьте, что таблицы созданы в Supabase

### ❌ "Prisma client not found"
```bash
npx prisma generate
```

### ❌ "API not responding"
```bash
npm run dev
```

## 🚀 Готово!

После настройки генерация контента будет работать с Supabase PostgreSQL базой данных!

**Схема Prisma уже исправлена на PostgreSQL** ✅
