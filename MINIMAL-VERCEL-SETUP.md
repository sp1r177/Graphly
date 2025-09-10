# 🎯 МИНИМАЛЬНАЯ НАСТРОЙКА VERCEL - ТОЛЬКО НУЖНЫЕ ПЕРЕМЕННЫЕ

## ✅ ВЫ ПРАВЫ! Нужен только DATABASE_URL

Для работы регистрации через Prisma нужна **ТОЛЬКО** одна переменная: `DATABASE_URL`

## 📋 ТОЧНАЯ ИНСТРУКЦИЯ:

### ШАГ 1: Получите DATABASE_URL из новой Supabase БД

1. **Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Проект**: `mpsrlymennzlzoogkpvc`
3. **Settings → Database**
4. **Connection string → URI**
5. **Скопируйте строку**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres
   ```

### ШАГ 2: Добавьте ТОЛЬКО нужные переменные в Vercel

**Vercel Dashboard → Settings → Environment Variables:**

```env
DATABASE_URL = postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
```

**НЕ ДОБАВЛЯЙТЕ** (пока не нужны):
- ❌ `SUPABASE_URL`
- ❌ `SUPABASE_ANON_KEY`  
- ❌ `YANDEX_API_KEY`
- ❌ `YANDEX_FOLDER_ID`

### ШАГ 3: Создайте таблицу users в Supabase

**Supabase SQL Editor** → **New query**:
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
```

### ШАГ 4: Redeploy
**Vercel Dashboard** → **Deployments** → **Redeploy** → **Skip Cache**

### ШАГ 5: Проверка
`https://graphly-five.vercel.app/api/debug`

**Должно показать:**
```json
{
  "environment": {
    "DATABASE_URL": "✅ Найден",
    "JWT_SECRET": "✅ Найден"
  },
  "database": {
    "status": "ready"
  }
}
```

## 🔍 **ПОЧЕМУ ТАК:**

### DATABASE_URL:
- ✅ **Используется Prisma** для подключения к PostgreSQL
- ✅ **Читается в `src/lib/db.ts`**
- ✅ **Нужен для всех операций с БД**

### SUPABASE_URL + SUPABASE_ANON_KEY:
- ⚠️ **Используются Supabase JavaScript клиентом**
- ⚠️ **В вашем проекте НЕ используются** для регистрации
- ⚠️ **Опциональны** (можете добавить позже)

## 🎯 **ИТОГ:**

**Для работы регистрации достаточно:**
1. `DATABASE_URL` - подключение к Supabase PostgreSQL
2. `JWT_SECRET` - для создания токенов
3. `NEXT_PUBLIC_BASE_URL` - URL сайта

**Остальные переменные опциональны!**

## 🚀 **ПОСЛЕ НАСТРОЙКИ:**

Логи покажут:
```
✅ Пользователь создан в БД: sp1r17@yandex.ru
```

**Вместо:**
```
❌ БД недоступна: Can't reach database server at localhost:5432
```

**Настройте DATABASE_URL с новой БД - и всё заработает!** 🎉
