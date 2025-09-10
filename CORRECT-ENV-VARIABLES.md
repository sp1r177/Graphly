# ✅ ПРАВИЛЬНЫЕ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ДЛЯ GRAPHLY

## 🎯 ВЫ ПРАВЫ! Давайте разберемся с переменными:

### 📋 КАКИЕ ПЕРЕМЕННЫЕ НУЖНЫ:

## 🔑 **ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ (для работы Prisma):**

```env
# ГЛАВНАЯ ПЕРЕМЕННАЯ - для Prisma подключения к БД
DATABASE_URL = postgresql://postgres:[ПАРОЛЬ]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres

# JWT для авторизации
JWT_SECRET = your-production-jwt-secret-123456789

# URL вашего сайта
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
```

## 🔧 **ОПЦИОНАЛЬНЫЕ ПЕРЕМЕННЫЕ (только если используете Supabase JavaScript клиент):**

```env
# Только если в коде есть supabase.from('table')
SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
SUPABASE_ANON_KEY = [ваш_anon_key]
```

## 🔍 **ПРОВЕРИМ ВАШ КОД:**

В `src/lib/db.ts` я вижу:
```typescript
// Prisma клиент (ОБЯЗАТЕЛЬНО нужен DATABASE_URL)
export const prisma = new PrismaClient()

// Supabase клиент (опционально, нужен только если используется)
export const supabase = createClient(supabaseUrl, supabaseKey)
```

В `src/app/api/auth/register/route.ts` используется:
```typescript
// Это требует DATABASE_URL
await prisma.user.create({...})
```

## 🎯 **ВЫВОД: НУЖЕН ТОЛЬКО DATABASE_URL!**

Для вашего проекта **достаточно только `DATABASE_URL`**!

`SUPABASE_URL` и `SUPABASE_ANON_KEY` нужны только если вы используете Supabase JavaScript клиент напрямую (что в вашем проекте не используется для регистрации).

## 🚀 **МИНИМАЛЬНАЯ НАСТРОЙКА VERCEL:**

### Добавьте ТОЛЬКО эти переменные:

```env
DATABASE_URL = postgresql://postgres:[ПАРОЛЬ]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
```

### Получите пароль для DATABASE_URL:
1. **Supabase Dashboard** → проект `mpsrlymennzlzoogkpvc`
2. **Settings → Database → Database Password**
3. **Скопируйте пароль** или создайте новый
4. **Замените `[ПАРОЛЬ]`** в `DATABASE_URL`

### Создайте таблицы:
**Supabase SQL Editor**:
```sql
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
```

## 🧪 **ПРОВЕРКА:**

После настройки откройте:
`https://graphly-five.vercel.app/api/debug`

**Должно показать:**
```json
{
  "environment": {
    "DATABASE_URL": "✅ Найден"
  },
  "database": {
    "status": "connected"
  }
}
```

## 🎉 **РЕЗУЛЬТАТ:**

**Вам нужен ТОЛЬКО `DATABASE_URL`** для работы регистрации через Prisma!

**Остальные Supabase переменные опциональны.**

**Настройте `DATABASE_URL` с новой БД и регистрация заработает!** 🚀
