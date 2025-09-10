# 🔍 ПРОВЕРКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ В VERCEL

## 🚨 КРИТИЧЕСКАЯ ОШИБКА НАЙДЕНА!

Из логов видно: `Can't reach database server at localhost:5432`

**Это означает**: `DATABASE_URL` в Vercel **НЕ НАСТРОЕН** или указывает на `localhost`!

## 📋 ПРОВЕРЬТЕ VERCEL DASHBOARD:

### ШАГ 1: Откройте Environment Variables
1. **Vercel Dashboard**
2. **Проект Graphly** 
3. **Settings**
4. **Environment Variables**

### ШАГ 2: Найдите DATABASE_URL
**Должно быть:**
```env
DATABASE_URL = postgresql://postgres:PASSWORD@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres
```

**НЕ должно быть:**
```env
DATABASE_URL = postgresql://localhost:5432/...
DATABASE_URL = file:./prisma/dev.db
```

### ШАГ 3: Если DATABASE_URL отсутствует или неправильный

**ДОБАВЬТЕ ПРАВИЛЬНЫЙ:**
```env
Name: DATABASE_URL
Value: postgresql://postgres:[ВАШ_ПАРОЛЬ_SUPABASE]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres
Environment: Production, Preview, Development
```

## 🔑 ПОЛУЧЕНИЕ ПАРОЛЯ SUPABASE:

1. **Supabase Dashboard**: https://supabase.com/dashboard
2. **Проект**: `tlorolxxxyztzrjlsjbwi`
3. **Settings → Database**
4. **Database Password**:
   - Если видите пароль → скопируйте
   - Если не видите → **Reset database password**
5. **СОХРАНИТЕ ПАРОЛЬ!**

## ⚡ БЫСТРАЯ ПРОВЕРКА:

После добавления/исправления `DATABASE_URL`:

1. **Redeploy**: Vercel Dashboard → Deployments → Redeploy (Skip Cache)
2. **Проверка**: `https://graphly-five.vercel.app/api/debug`

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

## 🎯 ТОЧНАЯ ДИАГНОСТИКА:

**Откройте**: `https://graphly-five.vercel.app/api/debug`

**Если DATABASE_URL правильный**, увидите:
- ✅ `"DATABASE_URL": "✅ Найден"`
- ✅ `"database": {"status": "connected"}`

**Если DATABASE_URL неправильный**, увидите:
- ❌ `"DATABASE_URL": "❌ Не найден"`
- ❌ `"database": {"status": "failed"}`

## 🔧 ПОЛНЫЙ СПИСОК ПЕРЕМЕННЫХ ДЛЯ VERCEL:

```env
DATABASE_URL = postgresql://postgres:[SUPABASE_PASSWORD]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres
SUPABASE_URL = https://tlorolxxxyztzrjlsjbwi.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3JvbHh4eXp0cnpqbHNqYndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5OTQsImV4cCI6MjA3Mjc3Mjk5NH0.GyGKbEOyjHynaAskHEZnamcTAkoY-C3_sFO_Y_1IX5M
JWT_SECRET = your-production-jwt-secret-123456789
NEXT_PUBLIC_BASE_URL = https://graphly-five.vercel.app
NODE_ENV = production
```

## 🎉 ПОСЛЕ ИСПРАВЛЕНИЯ:

- ✅ Логи покажут: `✅ Пользователь создан в БД: sp1r17@yandex.ru`
- ✅ Регистрация вернет код 200 вместо 400
- ✅ Логин вернет код 200 вместо 503
- ✅ Генерация контента заработает

**ГЛАВНОЕ: Исправьте DATABASE_URL в Vercel Environment Variables!** 🔑
