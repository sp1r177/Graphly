# 🚀 Быстрое исправление ошибки деплоя

## Проблема
```
Error: Missing Supabase environment variables
```

## ⚡ Быстрое решение

### 1. Добавьте переменные в Vercel
1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект → Settings → Environment Variables
3. Добавьте:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
```

### 2. Где взять значения
- **Supabase URL/Key**: Supabase Dashboard → Settings → API
- **Site URL**: URL вашего Vercel проекта

### 3. Передеплой
- Deployments → Redeploy последний деплой

## ✅ Готово!
После этого аутентификация заработает с подтверждением email.

---
*Если нужно настроить Supabase с нуля, смотрите SUPABASE_SETUP.md*
