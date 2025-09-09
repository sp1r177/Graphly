# 🔧 ИСПРАВЛЕНИЕ SUPABASE НА VERCEL

## 🎯 У ВАС УЖЕ ЕСТЬ SUPABASE ПРОЕКТ!

Проект: `tlorolxxxyztzrjlsjbwi`
URL: `https://tlorolxxxyztzrjlsjbwi.supabase.co`

## 📋 ТОЧНЫЕ ШАГИ ИСПРАВЛЕНИЯ:

### ШАГ 1: Получите пароль Supabase БД

1. **Зайдите в Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Откройте ваш проект**: `tlorolxxxyztzrjlsjbwi`
3. **Settings → Database**
4. **Найдите "Database Password"**
5. **Если пароль забыт** - нажмите "Reset database password"
6. **СОХРАНИТЕ ПАРОЛЬ!** (например: `MyPassword123`)

### ШАГ 2: Добавьте переменные в Vercel

**Vercel Dashboard → Settings → Environment Variables:**

```env
# Замените [ВАШ_ПАРОЛЬ] на реальный пароль из шага 1
DATABASE_URL = postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres

# Supabase API ключи (уже готовые)
SUPABASE_URL = https://tlorolxxxyztzrjlsjbwi.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3JvbHh4eXp0cnpqbHNqYndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5OTQsImV4cCI6MjA3Mjc3Mjk5NH0.GyGKbEOyjHynaAskHEZnamcTAkoY-C3_sFO_Y_1IX5M

# JWT Secret
JWT_SECRET = your-super-secret-jwt-key-for-production-12345

# Next.js
NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app

# Yandex GPT (опционально)
YANDEX_API_KEY = your-yandex-api-key
YANDEX_FOLDER_ID = your-yandex-folder-id
```

### ШАГ 3: Создайте таблицы в Supabase

**Вариант A: Через Supabase SQL Editor**
1. Supabase Dashboard → SQL Editor
2. Скопируйте и выполните этот SQL:

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
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  "outputText" TEXT,
  "outputImageUrl" TEXT,
  "templateType" TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Создание таблицы платежей
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT DEFAULT 'PENDING',
  "yandexPaymentId" TEXT,
  "subscriptionType" TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

**Вариант B: Через API после деплоя**
Откройте: `https://your-domain.vercel.app/api/setup-db`

### ШАГ 4: Деплой и проверка

```bash
git add .
git commit -m "Configure Supabase for Vercel production"
git push origin main
```

### ШАГ 5: Тестирование

1. **Диагностика**: `https://your-domain.vercel.app/api/debug`
   
   **Должно показать:**
   ```json
   {
     "environment": {
       "DATABASE_URL": "✅ Найден",
       "SUPABASE_URL": "✅ Найден",
       "JWT_SECRET": "✅ Найден"
     },
     "database": {
       "status": "ready",
       "tablesExist": true
     }
   }
   ```

2. **Регистрация**: `https://your-domain.vercel.app/auth/register`
   - Введите email и пароль
   - Должно создать пользователя в Supabase

3. **Проверка в Supabase**: 
   - Table Editor → users
   - Должен появиться новый пользователь

## 🔍 ВОЗМОЖНЫЕ ПРОБЛЕМЫ

### "Connection failed"
- Проверьте пароль БД в Supabase
- Убедитесь, что `[ВАШ_ПАРОЛЬ]` заменен на реальный

### "Table doesn't exist"
- Выполните SQL из шага 3 в Supabase SQL Editor
- Или откройте `/api/setup-db` POST

### "User creation failed"
- Проверьте уникальность email
- Проверьте права в Supabase

## 🎯 ГОТОВЫЕ НАСТРОЙКИ

Ваш Supabase проект уже настроен, нужно только:
1. **Получить пароль БД**
2. **Добавить переменные в Vercel**
3. **Создать таблицы**
4. **Протестировать**

## 🚀 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

После настройки:
- ✅ Регистрация создает пользователей в Supabase PostgreSQL
- ✅ Логин находит пользователей в БД
- ✅ Генерация сохраняет историю
- ✅ Лимиты отслеживаются корректно

**Регистрация заработает сразу после настройки Supabase!** 🎉
