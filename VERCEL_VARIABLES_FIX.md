# 🔧 ИСПРАВЛЕНИЕ ПЕРЕМЕННЫХ В VERCEL

## Проблема
В Vercel у вас переменные называются:
- `SUPABASE_URL` 
- `SUPABASE_ANON_KEY`

А в коде мы ищем:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ⚡ РЕШЕНИЕ

### 1. Добавьте правильные переменные в Vercel
В Vercel Dashboard → Settings → Environment Variables добавьте:

```
NEXT_PUBLIC_SUPABASE_URL = https://mpsrlymennzlzoogkpvc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc3JseW1lbm56bHpvb2drcHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjA0MjAsImV4cCI6MjA3MzAzNjQyMH0.wSkLb0gJ9y5CKerSobBDLma_5oXu61VbQWQBy-2wEfc
NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
```

### 2. Убедитесь что переменные добавлены для всех окружений
- ✅ Production
- ✅ Preview  
- ✅ Development

### 3. Redeploy проект
После добавления переменных сделайте redeploy

### 4. Проверьте
Откройте `/test-env` - должны увидеть переменные

## 🎯 После этого будет работать:
- ✅ Регистрация с подтверждением email
- ✅ Вход в систему
- ✅ Выход
- ✅ Все через Supabase!

## 📋 SQL для Supabase
Не забудьте выполнить SQL из `supabase-setup.sql` в Supabase Dashboard!
