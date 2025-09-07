# 🔧 Исправление интеграции с Supabase

## Проблема: Приложение не работает с Supabase

### ✅ Что исправлено:

1. **Добавлен Supabase клиент** в `src/lib/db.ts`
2. **Обновлен код регистрации** для работы с Supabase
3. **Добавлен тест Supabase** подключения
4. **Обновлен package.json** для установки Supabase

### 🚀 Что нужно сделать:

#### 1. Установить Supabase клиент:
```bash
npm install @supabase/supabase-js
```

#### 2. Задеплоить изменения:
```bash
git add .
git commit -m "Add Supabase integration"
git push
```

#### 3. Проверить переменные в Vercel:
Убедитесь, что в Vercel есть:
- `SUPABASE_URL` = `https://tlorolxxxyztzrjlsjbwi.supabase.co`
- `SUPABASE_ANON_KEY` = ваш anon key
- `DATABASE_URL` = строка подключения к PostgreSQL

#### 4. Проверить работу:
- `https://your-app.vercel.app/api/test-supabase` - тест Supabase
- `https://your-app.vercel.app/api/debug` - все переменные
- `https://your-app.vercel.app/api/test-db` - тест БД

### 🔍 Диагностика:

#### Если Supabase не работает:
1. Проверьте, что `SUPABASE_ANON_KEY` правильный
2. Проверьте, что `SUPABASE_URL` правильный
3. Проверьте, что в Supabase созданы таблицы

#### Если БД не работает:
1. Проверьте, что `DATABASE_URL` содержит правильный пароль
2. Запустите `npx prisma db push` для применения схемы

### 📋 Переменные для Vercel:

```env
SUPABASE_URL=https://tlorolxxxyztzrjlsjbwi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres
JWT_SECRET=your-jwt-secret
YANDEX_API_KEY=your-yandex-api-key
YANDEX_FOLDER_ID=your-yandex-folder-id
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
NODE_ENV=production
```

### 🎯 После исправления:

1. ✅ Supabase будет подключен
2. ✅ Регистрация заработает
3. ✅ Генерация контента заработает
4. ✅ Заглушки исчезнут

**Главное: установите Supabase клиент и задеплойте изменения!**
