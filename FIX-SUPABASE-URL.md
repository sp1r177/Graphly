# 🔧 ИСПРАВЛЕНИЕ: Неправильный SUPABASE_URL

## ❌ **ПРОБЛЕМА НАЙДЕНА!**

**Ошибка:** `Supabase client not initialized`

**Причина:** Неправильный `SUPABASE_URL` в Vercel

---

## 🚨 **ЧТО НЕ ТАК:**

### **Неправильно (у вас сейчас):**
```env
SUPABASE_URL = postgresql://postgres:SP#c73r1sp3c73r1@db.mpsrlymennzlzoogkpvc.supabase.co:5432/postgres
```

**Это `DATABASE_URL` для Prisma, а не `SUPABASE_URL` для JavaScript клиента!**

### **Правильно должно быть:**
```env
SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc3JseW1lbm56bHpvb2drcHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjA0MjAsImV4cCI6MjA3MzAzNjQyMH0.wSkLb0gJ9y5CKerSobBDLma_5oXu61VbQWQBy-2wEfc
```

---

## ✅ **ИСПРАВЛЕНИЕ:**

### **ШАГ 1: Обновите переменные в Vercel**

**Vercel Dashboard** → **Settings** → **Environment Variables**

**Найдите `SUPABASE_URL` и замените на:**
```
https://mpsrlymennzlzoogkpvc.supabase.co
```

**Оставьте `SUPABASE_ANON_KEY` как есть:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc3JseW1lbm56bHpvb2drcHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjA0MjAsImV4cCI6MjA3MzAzNjQyMH0.wSkLb0gJ9y5CKerSobBDLma_5oXu61VbQWQBy-2wEfc
```

### **ШАГ 2: Redeploy**

**Vercel Dashboard** → **Deployments** → **Redeploy** → **Skip Cache**

---

## 🧪 **ПРОВЕРКА:**

### **1. Проверьте переменные:**
`https://graphly-five.vercel.app/api/debug`

**Должно показать:**
```json
{
  "environment": {
    "SUPABASE_URL": "✅ Найден",
    "SUPABASE_ANON_KEY": "✅ Найден"
  }
}
```

### **2. Проверьте регистрацию:**
`https://graphly-five.vercel.app/auth/register`

**Попробуйте зарегистрироваться!**

---

## 🎯 **ПОЧЕМУ ТАК:**

**Supabase JavaScript клиент ожидает:**
- `SUPABASE_URL` = `https://mpsrlymennzlzoogkpvc.supabase.co` (HTTPS URL)
- `SUPABASE_ANON_KEY` = `eyJ...` (JWT токен)

**А не PostgreSQL connection string!**

---

## 🚀 **РЕЗУЛЬТАТ:**

**После исправления `SUPABASE_URL`:**
- ✅ Supabase клиент инициализируется
- ✅ Регистрация заработает
- ✅ Логи покажут: `✅ Пользователь создан в Supabase`

**Исправьте `SUPABASE_URL` на HTTPS URL - и всё заработает!** 🎉
