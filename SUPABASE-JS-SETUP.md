# 🚀 НАСТРОЙКА SUPABASE JAVASCRIPT

## ✅ **Код обновлен! Теперь используем Supabase JavaScript клиент**

### **Что изменилось:**
1. **Убрали Prisma** - больше не нужен `DATABASE_URL`
2. **Добавили Supabase JavaScript** - используем `SUPABASE_URL` + `SUPABASE_ANON_KEY`
3. **Создали helper функции** - `db.createUser()`, `db.findUserByEmail()` и т.д.

---

## 🔧 **ШАГ 1: Создайте таблицы в Supabase**

### **Supabase Dashboard** → **SQL Editor** → **New query**

**Скопируйте и выполните SQL из файла `SUPABASE-TABLES-SQL.sql`:**

```sql
-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  subscription_status TEXT DEFAULT 'FREE',
  usage_count_day INTEGER DEFAULT 0,
  usage_count_month INTEGER DEFAULT 0,
  last_generation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица генераций
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  output_text TEXT NOT NULL,
  template_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔑 **ШАГ 2: Обновите переменные в Vercel**

### **Vercel Dashboard** → **Settings** → **Environment Variables**

**Удалите:**
- ❌ `DATABASE_URL` (больше не нужен)

**Добавьте/обновите:**
```env
SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
SUPABASE_ANON_KEY = [ваш_anon_key]
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
```

### **Получите SUPABASE_ANON_KEY:**
1. **Supabase Dashboard** → проект `mpsrlymennzlzoogkpvc`
2. **Settings → API**
3. **Project API keys** → **anon public**
4. **Скопируйте ключ**

---

## 🚀 **ШАГ 3: Деплой**

```bash
git add .
git commit -m "Switch to Supabase JavaScript client"
git push origin main
```

**Vercel автоматически задеплоит изменения**

---

## 🧪 **ШАГ 4: Проверка**

### **1. Проверьте переменные:**
`https://graphly-five.vercel.app/api/debug`

**Должно показать:**
```json
{
  "environment": {
    "SUPABASE_URL": "✅ Найден",
    "SUPABASE_ANON_KEY": "✅ Найден"
  },
  "database": {
    "status": "connected"
  }
}
```

### **2. Проверьте регистрацию:**
`https://graphly-five.vercel.app/auth/register`

**Попробуйте зарегистрироваться!**

---

## 🎉 **ПРЕИМУЩЕСТВА SUPABASE JAVASCRIPT:**

1. **Автоматические таблицы** - создали через SQL
2. **Встроенная аутентификация** - используем JWT
3. **Простая настройка** - только 2 переменные
4. **Real-time функции** - для будущих фич
5. **RLS политики** - безопасность на уровне БД

---

## 🔍 **ЕСЛИ НЕ РАБОТАЕТ:**

### **Проверьте логи Vercel:**
**Vercel Dashboard** → **Functions** → **View Function Logs**

### **Возможные ошибки:**
1. **Таблицы не созданы** - выполните SQL в Supabase
2. **Неправильный SUPABASE_ANON_KEY** - проверьте в Supabase Dashboard
3. **Неправильный SUPABASE_URL** - должен быть `https://mpsrlymennzlzoogkpvc.supabase.co`

---

## 🎯 **РЕЗУЛЬТАТ:**

**После настройки:**
- ✅ Регистрация заработает через Supabase
- ✅ Пользователи сохранятся в БД
- ✅ Логи покажут: `✅ Пользователь создан в Supabase`

**Настройте таблицы и переменные - и всё заработает!** 🚀
