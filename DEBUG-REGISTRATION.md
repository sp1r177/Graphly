# 🚨 ДИАГНОСТИКА РЕГИСТРАЦИИ

## 🔍 **ПРОВЕРИМ ЧТО ПРОИСХОДИТ:**

### 1. **Проверьте переменные:**
Откройте: `https://graphly-five.vercel.app/api/debug`

**Что показывает?** Скопируйте сюда ответ.

### 2. **Проверьте логи Vercel:**
**Vercel Dashboard** → **Functions** → **View Function Logs**

**Какие ошибки в логах?** Скопируйте сюда.

### 3. **Попробуйте зарегистрироваться:**
`https://graphly-five.vercel.app/auth/register`

**Какая ошибка?** Скопируйте сюда текст ошибки.

---

## 🤔 **ВОЗМОЖНЫЕ ПРИЧИНЫ:**

### **1. Таблицы не созданы в Supabase**
- Нужно выполнить SQL в Supabase Dashboard

### **2. Неправильные переменные**
- `SUPABASE_URL` или `SUPABASE_ANON_KEY` не настроены

### **3. Ошибка в коде**
- Нужно исправить API роут

### **4. Проблема с Supabase**
- БД недоступна или неправильно настроена

---

## 🚀 **БЫСТРОЕ ИСПРАВЛЕНИЕ:**

### **ШАГ 1: Создайте таблицы в Supabase**
1. **Supabase Dashboard** → **SQL Editor**
2. **New query**
3. **Скопируйте и выполните:**

```sql
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
```

### **ШАГ 2: Проверьте переменные в Vercel**
```env
SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
SUPABASE_ANON_KEY = [ваш_anon_key]
```

### **ШАГ 3: Redeploy**
**Vercel Dashboard** → **Redeploy** → **Skip Cache**

---

## 📋 **СНАЧАЛА СКАЖИТЕ:**

1. **Что показывает** `/api/debug`?
2. **Какие ошибки** в Vercel логах?
3. **Какая ошибка** при регистрации?

**Тогда я точно исправлю проблему!** 🎯
