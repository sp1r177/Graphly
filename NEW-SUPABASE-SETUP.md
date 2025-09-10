# 🆕 Настройка новой Supabase БД для Graphly

## ✅ НОВАЯ БАЗА ДАННЫХ СОЗДАНА!

**Ваш новый Supabase проект**: `mpsrlymennzlzoogkpvc`
**URL**: `https://mpsrlymennzlzoogkpvc.supabase.co`

## 📋 НАСТРОЙКА ЗА 5 МИНУТ:

### ШАГ 1: Получите строку подключения
1. **Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Откройте проект**: `mpsrlymennzlzoogkpvc`
3. **Settings → Database**
4. **Connection string → URI**
5. **Скопируйте строку**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres
   ```

### ШАГ 2: Получите API ключи
В том же проекте:
1. **Settings → API**
2. **Project URL**: `https://mpsrlymennzlzoogkpvc.supabase.co`
3. **anon/public key**: скопируйте ключ

### ШАГ 3: Обновите переменные в Vercel

**Vercel Dashboard → Settings → Environment Variables:**

**УДАЛИТЕ старые переменные** (с `tlorolxxxyztzrjlsjbwi`) и **добавьте новые**:

```env
# Новая Supabase БД
DATABASE_URL = postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres

# Новые Supabase API ключи
SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
SUPABASE_ANON_KEY = [ВАШ_НОВЫЙ_ANON_KEY]

# Остальные переменные
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
NODE_ENV = production

# Yandex GPT (опционально)
YANDEX_API_KEY = your-yandex-api-key
YANDEX_FOLDER_ID = your-yandex-folder-id
```

**ВАЖНО**: Замените `[ВАШ_ПАРОЛЬ]` и `[ВАШ_НОВЫЙ_ANON_KEY]` на реальные значения!

### ШАГ 4: Создайте таблицы в новой БД

**Supabase SQL Editor**:
1. **SQL Editor** в Supabase Dashboard
2. **Выполните этот SQL**:

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

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations("userId");
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments("userId");
```

### ШАГ 5: Redeploy на Vercel

```bash
# Если нужно закоммитить изменения
git add .
git commit -m "Update to new Supabase database"
git push origin main
```

**Или просто Redeploy**:
Vercel Dashboard → Deployments → Redeploy → Skip Cache

### ШАГ 6: Проверка работы

1. **Диагностика**: `https://graphly-five.vercel.app/api/debug`
2. **Тест Supabase**: `https://graphly-five.vercel.app/api/test-supabase-connection`
3. **Регистрация**: `https://graphly-five.vercel.app/auth/register`

## 📊 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ:

### Диагностика покажет:
```json
{
  "supabaseProject": "mpsrlymennzlzoogkpvc",
  "environment": {
    "DATABASE_URL": "✅ Найден",
    "SUPABASE_URL": "✅ Найден"
  },
  "database": {
    "status": "ready",
    "userCount": 0
  }
}
```

### Логи регистрации покажут:
```
✅ Пользователь создан в БД: sp1r17@yandex.ru
```

**Вместо:**
```
❌ БД недоступна: Can't reach database server at localhost:5432
```

## 🎯 РЕЗУЛЬТАТ:

После настройки новой Supabase БД:
- ✅ Регистрация будет создавать пользователей
- ✅ Логин будет находить пользователей
- ✅ Генерация будет работать с лимитами
- ✅ История будет сохраняться

**Новая БД решит все проблемы с регистрацией!** 🚀
