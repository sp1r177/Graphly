# 🎯 ЧЕТКОЕ ОБЪЯСНЕНИЕ ПЕРЕМЕННЫХ

## ❓ **ПОЧЕМУ DATABASE_URL, А НЕ SUPABASE_URL?**

### В вашем коде используется **Prisma**, а не Supabase JavaScript клиент!

**Смотрите в `src/lib/db.ts`:**
```typescript
// Это Prisma клиент - читает DATABASE_URL
export const prisma = new PrismaClient()

// Это Supabase клиент - читает SUPABASE_URL (но НЕ используется!)
export const supabase = createClient(supabaseUrl, supabaseKey)
```

**В API роутах используется ТОЛЬКО Prisma:**
```typescript
// src/app/api/auth/register/route.ts
await prisma.user.create({...}) // ← Это читает DATABASE_URL

// src/app/api/generate/route.ts  
await prisma.user.findUnique({...}) // ← Это читает DATABASE_URL
```

**Supabase JavaScript клиент НЕ используется нигде!**

---

## 📋 **ТОЧНЫЕ ПЕРЕМЕННЫЕ ДЛЯ VERCEL:**

### ✅ **ОБЯЗАТЕЛЬНЫЕ (для работы регистрации):**

```env
DATABASE_URL = postgresql://postgres:[ПАРОЛЬ]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
```

### ⚠️ **ОПЦИОНАЛЬНЫЕ (можно добавить, но не обязательно):**

```env
SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
SUPABASE_ANON_KEY = [ваш_anon_key]
YANDEX_API_KEY = [ваш_yandex_key]
YANDEX_FOLDER_ID = [ваш_folder_id]
```

---

## 🔍 **ОТКУДА ВЗЯТЬ ЗНАЧЕНИЯ:**

### 1. **DATABASE_URL** (ГЛАВНАЯ ПЕРЕМЕННАЯ):
1. **Supabase Dashboard** → проект `mpsrlymennzlzoogkpvc`
2. **Settings → Database**
3. **Connection string → URI**
4. **Скопируйте строку** (замените `[YOUR-PASSWORD]` на реальный пароль)

### 2. **JWT_SECRET** (любая случайная строка):
```
your-production-jwt-secret-123456789
```

### 3. **NEXT_PUBLIC_BASE_URL** (URL вашего сайта):
```
https://graphly-five.vercel.app
```

---

## 🎯 **ПОЧЕМУ ТАК:**

### Prisma (используется в коде):
- ✅ Читает `DATABASE_URL`
- ✅ Подключается к PostgreSQL напрямую
- ✅ Работает с таблицами через SQL

### Supabase JavaScript клиент (НЕ используется):
- ❌ Читает `SUPABASE_URL` + `SUPABASE_ANON_KEY`
- ❌ Используется для `supabase.from('table')`
- ❌ В вашем коде этого НЕТ!

---

## 🚀 **ПРОСТАЯ НАСТРОЙКА:**

### ШАГ 1: Получите пароль БД
**Supabase** → **Settings → Database → Database Password**

### ШАГ 2: Добавьте в Vercel ТОЛЬКО:
```env
DATABASE_URL = postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
```

### ШАГ 3: Создайте таблицу в Supabase SQL Editor:
```sql
CREATE TABLE users (
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

---

## 🎉 **РЕЗУЛЬТАТ:**

**После настройки `DATABASE_URL`:**
- ✅ Регистрация заработает
- ✅ Пользователи сохранятся в БД
- ✅ Логи покажут: `✅ Пользователь создан в БД`

**Остальные переменные опциональны!**

---

## 💡 **КРАТКИЙ ОТВЕТ:**

**Нужен ТОЛЬКО `DATABASE_URL`** - потому что ваш код использует Prisma, а не Supabase JavaScript клиент!

**`SUPABASE_URL` и `SUPABASE_ANON_KEY`** - для Supabase JavaScript клиента, который в вашем проекте НЕ используется!
