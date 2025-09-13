# 🎯 ПРОСТОЕ ИСПРАВЛЕНИЕ

## Проблема решена!
Теперь код использует ТОЛЬКО те переменные, которые у вас уже есть в Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## ✅ Что нужно сделать:

### 1. В Vercel Dashboard
Добавьте только одну переменную:
```
SITE_URL = https://your-domain.vercel.app
```

### 2. В Supabase Dashboard
1. Откройте SQL Editor
2. Скопируйте содержимое `supabase-setup.sql`
3. Выполните SQL

### 3. Настройте Authentication
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/auth/callback`
- Включите email confirmation

### 4. Redeploy проект

## 🎉 Готово!
После этого все будет работать с Supabase!

**Никаких NEXT_PUBLIC_ переменных не нужно!**
