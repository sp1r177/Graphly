# 🔧 ИСПРАВЛЕНИЕ: Supabase client not initialized

## ❌ **ПРОБЛЕМА НАЙДЕНА!**

**Ошибка:** `Supabase client not initialized`

**Причина:** В Vercel не настроены переменные `SUPABASE_URL` или `SUPABASE_ANON_KEY`

---

## ✅ **ИСПРАВЛЕНИЕ (3 ШАГА):**

### **ШАГ 1: Получите SUPABASE_ANON_KEY**

1. **Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Проект**: `mpsrlymennzlzoogkpvc`
3. **Settings → API**
4. **Project API keys** → **anon public**
5. **Скопируйте ключ** (длинная строка, начинается с `eyJ...`)

### **ШАГ 2: Добавьте переменные в Vercel**

**Vercel Dashboard** → **Settings** → **Environment Variables**

**Добавьте/обновите:**
```env
SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
SUPABASE_ANON_KEY = [ваш_anon_key_из_шага_1]
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
```

**Удалите (если есть):**
- ❌ `DATABASE_URL` (больше не нужен)

### **ШАГ 3: Redeploy**

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

**В коде `src/lib/db.ts`:**
```typescript
export const supabase = (isValidHttpUrl(supabaseUrl) && !!supabaseKey)
  ? createClient(supabaseUrl as string, supabaseKey as string)
  : null
```

**Если `SUPABASE_URL` или `SUPABASE_ANON_KEY` не найдены:**
- `supabase` становится `null`
- При вызове `db.createUser()` → ошибка `Supabase client not initialized`

---

## 🚀 **РЕЗУЛЬТАТ:**

**После настройки переменных:**
- ✅ Supabase клиент инициализируется
- ✅ Регистрация заработает
- ✅ Логи покажут: `✅ Пользователь создан в Supabase`

**Настройте переменные в Vercel - и всё заработает!** 🎉
