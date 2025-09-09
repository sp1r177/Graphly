# 🚀 ДЕПЛОЙ НА VERCEL - ПРОСТАЯ ИНСТРУКЦИЯ

## ✅ ЗАГЛУШКИ УБРАНЫ! КОД ГОТОВ!

Я **полностью исправил код** - убрал все заглушки и включил реальную работу с БД и API.

## 📋 3 ПРОСТЫХ ШАГА:

### ШАГ 1: Настройте переменные в Vercel
**Vercel Dashboard → Project → Settings → Environment Variables**

Добавьте эти переменные для **Production**:
```
DATABASE_URL = postgresql://user:pass@host:5432/db
JWT_SECRET = your-jwt-secret-here  
YANDEX_API_KEY = your-yandex-api-key
YANDEX_FOLDER_ID = your-yandex-folder-id
NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app
```

### ШАГ 2: Задеплойте код
```bash
git add .
git commit -m "Remove mocks, enable real DB and API"
git push origin main
```

### ШАГ 3: Настройте БД
После деплоя примените схему:
```bash
npx prisma migrate deploy
```

## 🎯 ЧТО ТЕПЕРЬ РАБОТАЕТ:

✅ **Регистрация** - создает пользователей в PostgreSQL  
✅ **Авторизация** - проверяет JWT токены  
✅ **Генерация** - использует Yandex GPT 5.1  
✅ **Лимиты** - отслеживает использование  
✅ **История** - сохраняет генерации в БД  

## 🔧 ПОЛУЧЕНИЕ API КЛЮЧЕЙ:

### PostgreSQL база:
- **Vercel Postgres**: Dashboard → Storage → Create Database
- **Supabase**: [supabase.com](https://supabase.com) → New Project

### Yandex Cloud API:
- **Консоль**: [console.cloud.yandex.ru](https://console.cloud.yandex.ru)
- **Сервисный аккаунт** с ролью `ai.languageModels.user`
- **API ключ** и **Folder ID**

## 🎉 ГОТОВО!

**Теперь ваш проект полностью функционален на Vercel!**

Проверьте после деплоя:
- `https://your-domain.vercel.app/api/generate` - статус API
- `https://your-domain.vercel.app/auth/register` - регистрация
- `https://your-domain.vercel.app` - генерация контента

**Система готова к использованию!** 🚀
