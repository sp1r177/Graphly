# 🚀 Настройка Graphly на Vercel - Финальная инструкция

## ✅ КОД ИСПРАВЛЕН!

Я **убрал все заглушки** и включил реальную работу с базой данных:
- ✅ Регистрация создает пользователей в БД
- ✅ Генерация проверяет лимиты и сохраняет историю
- ✅ Авторизация работает через JWT токены
- ✅ Yandex GPT интегрирован

## 📋 НАСТРОЙКА VERCEL (5 МИНУТ)

### ШАГ 1: Переменные окружения в Vercel

**Vercel Dashboard → Project → Settings → Environment Variables**

Добавьте для **Production**:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-for-production
YANDEX_API_KEY=your-yandex-cloud-api-key
YANDEX_FOLDER_ID=your-yandex-cloud-folder-id
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### ШАГ 2: База данных (PostgreSQL)

**Вариант A: Vercel Postgres**
1. Vercel Dashboard → Storage → Create Database
2. Выберите Postgres
3. Скопируйте `DATABASE_URL` в переменные окружения

**Вариант B: Supabase (рекомендуется)**
1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Скопируйте Database URL из Settings → Database
4. Добавьте в Vercel как `DATABASE_URL`

### ШАГ 3: Yandex Cloud API

1. **Зайдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)**
2. **Создайте проект** (если нет)
3. **Включите Yandex GPT API**
4. **Создайте сервисный аккаунт:**
   - IAM → Сервисные аккаунты → Создать
   - Роли: `ai.languageModels.user`
5. **Создайте API ключ:**
   - Выберите сервисный аккаунт → Создать ключ → API ключ
   - Скопируйте ключ → это `YANDEX_API_KEY`
6. **Получите Folder ID:**
   - В консоли скопируйте ID каталога → это `YANDEX_FOLDER_ID`

### ШАГ 4: Деплой

```bash
git add .
git commit -m "Enable real database and API functionality"
git push origin main
```

### ШАГ 5: Применение схемы БД

После первого успешного деплоя:

**Через Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

**Или через SQL (если Supabase):**
1. Откройте SQL Editor в Supabase
2. Выполните команды из `prisma/schema.prisma`

## ✅ ПРОВЕРКА РАБОТЫ

### Тест API статуса:
`https://your-domain.vercel.app/api/generate`

**Ожидаемый ответ:**
```json
{
  "status": "OK",
  "environment": {
    "DATABASE_URL": "✅ Найден",
    "JWT_SECRET": "✅ Найден",
    "YANDEX_API_KEY": "✅ Найден",
    "YANDEX_FOLDER_ID": "✅ Найден"
  }
}
```

### Тест регистрации:
1. Откройте `https://your-domain.vercel.app/auth/register`
2. Зарегистрируйтесь
3. Должен создаться пользователь в БД

### Тест генерации:
1. Войдите в аккаунт
2. Попробуйте сгенерировать контент
3. Должно работать с реальным Yandex GPT

## 🐛 РЕШЕНИЕ ПРОБЛЕМ

### "Build failed"
- Проверьте логи сборки
- Убедитесь, что `DATABASE_URL` не пустой
- Проверьте синтаксис в коде

### "Database connection failed"
- Проверьте `DATABASE_URL`
- Убедитесь, что БД доступна
- Примените схему: `npx prisma migrate deploy`

### "User registration failed"
- Проверьте подключение к БД
- Убедитесь, что таблицы созданы
- Проверьте уникальность email

### "Generation failed"
- Проверьте Yandex API ключи
- Убедитесь в правах сервисного аккаунта
- Проверьте квоты API

### "Unauthorized"
- Зарегистрируйтесь/войдите в аккаунт
- Проверьте JWT_SECRET
- Очистите cookies браузера

## 📊 МОНИТОРИНГ

### Vercel Function Logs:
1. Dashboard → Functions → `/api/generate`
2. Просмотр логов в реальном времени
3. Анализ ошибок

### База данных:
- Мониторинг создания пользователей
- Отслеживание генераций
- Проверка лимитов использования

## 🎯 ИТОГ

После настройки:
- ✅ Пользователи регистрируются в реальной БД
- ✅ Генерация работает с Yandex GPT
- ✅ Лимиты отслеживаются корректно
- ✅ История сохраняется в БД
- ✅ Система готова к продакшену

**Проект готов к полноценному использованию на Vercel!** 🚀
