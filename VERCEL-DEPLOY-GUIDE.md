# 🚀 Деплой Graphly на Vercel - Пошаговое руководство

## 🎯 ЦЕЛЬ: Запустить проект на Vercel без локальной разработки

## 📋 ПОДГОТОВКА К ДЕПЛОЮ

### ШАГ 1: Очистка проекта
```cmd
# Запустите скрипт очистки
CLEAN-AND-DEPLOY.bat
```

Этот скрипт удалит:
- ❌ Лишние .bat файлы
- ❌ Тестовые .html файлы  
- ❌ Дублированные .md файлы
- ❌ Временные .js файлы
- ❌ Дубли env файлов

### ШАГ 2: Проверка основных файлов
После очистки должны остаться только:
- ✅ `src/` - исходный код
- ✅ `prisma/` - схема базы данных
- ✅ `package.json` - зависимости
- ✅ `vercel.json` - конфигурация Vercel
- ✅ `.env.example` - шаблон переменных
- ✅ `README.md` - документация

## 🌐 НАСТРОЙКА VERCEL

### ШАГ 3: Переменные окружения в Vercel
1. **Откройте Vercel Dashboard**
2. **Выберите ваш проект**
3. **Settings → Environment Variables**
4. **Добавьте переменные:**

```env
# Обязательные переменные
DATABASE_URL = postgresql://user:password@host:5432/database
JWT_SECRET = your-super-secret-jwt-key-for-production
YANDEX_API_KEY = your-yandex-cloud-api-key
YANDEX_FOLDER_ID = your-yandex-cloud-folder-id
NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app
NODE_ENV = production

# Опциональные (если используете)
SUPABASE_URL = your-supabase-url
SUPABASE_ANON_KEY = your-supabase-anon-key
```

### ШАГ 4: Настройка базы данных (Production)
Для продакшена нужна PostgreSQL база:

**Вариант A: Vercel Postgres**
1. В Vercel Dashboard → Storage → Create Database
2. Выберите Postgres
3. Скопируйте DATABASE_URL в переменные окружения

**Вариант B: Внешняя PostgreSQL**
1. Создайте базу на Supabase, Railway, или другом сервисе
2. Получите строку подключения
3. Добавьте в переменные окружения как DATABASE_URL

### ШАГ 5: Получение Yandex Cloud API ключей
1. **Зайдите в Yandex Cloud Console**
2. **Создайте проект** (если нет)
3. **Создайте сервисный аккаунт:**
   - IAM → Сервисные аккаунты → Создать
   - Назначьте роли: `ai.languageModels.user`
4. **Создайте API ключ:**
   - Выберите сервисный аккаунт → Создать ключ → API ключ
   - Скопируйте ключ (YANDEX_API_KEY)
5. **Получите Folder ID:**
   - В консоли откройте проект
   - Скопируйте ID каталога (YANDEX_FOLDER_ID)

## 🚀 ДЕПЛОЙ НА VERCEL

### ШАГ 6: Коммит и пуш
```bash
# Добавить все изменения
git add .

# Создать коммит
git commit -m "Clean project and deploy to Vercel"

# Отправить на GitHub
git push origin main
```

### ШАГ 7: Подключение к Vercel
1. **Зайдите в Vercel Dashboard**
2. **New Project → Import Git Repository**
3. **Выберите ваш репозиторий Graphly**
4. **Configure Project:**
   - Framework: Next.js
   - Build Command: `npx prisma generate && next build`
   - Output Directory: `.next`
5. **Deploy**

### ШАГ 8: Применение схемы БД (после первого деплоя)
После успешного деплоя примените схему к продакшн БД:

**Через Vercel CLI:**
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Подключитесь к проекту
vercel link

# Примените миграции
vercel env pull .env.local
npx prisma migrate deploy
```

**Или через веб-интерфейс БД** (если используете Supabase/Railway):
- Скопируйте содержимое `prisma/schema.prisma`
- Создайте таблицы через SQL Editor

## ✅ ПРОВЕРКА ДЕПЛОЯ

### ШАГ 9: Тестирование
1. **Откройте ваш сайт:** `https://your-domain.vercel.app`
2. **Проверьте API:** `https://your-domain.vercel.app/api/generate`
3. **Ожидаемый ответ:**
```json
{
  "status": "OK",
  "message": "Generate API работает",
  "environment": {
    "DATABASE_URL": "✅ Найден",
    "JWT_SECRET": "✅ Найден",
    "YANDEX_API_KEY": "✅ Найден",
    "YANDEX_FOLDER_ID": "✅ Найден"
  }
}
```

4. **Протестируйте регистрацию:**
   - Зайдите на `/auth/register`
   - Создайте аккаунт
   - Проверьте, что пользователь сохранился в БД

5. **Протестируйте генерацию:**
   - Войдите в аккаунт
   - Попробуйте сгенерировать контент
   - Проверьте, что генерация работает

## 🐛 РЕШЕНИЕ ПРОБЛЕМ

### "Build failed"
- Проверьте логи сборки в Vercel
- Убедитесь, что все зависимости в `package.json`
- Проверьте синтаксис в файлах

### "Database connection failed"
- Проверьте переменную `DATABASE_URL`
- Убедитесь, что БД доступна извне
- Примените схему Prisma к БД

### "API returns 500 error"
- Проверьте Function Logs в Vercel
- Убедитесь, что все переменные окружения настроены
- Проверьте права доступа к Yandex Cloud

### "Yandex GPT не работает"
- Проверьте API ключ и Folder ID
- Убедитесь, что у сервисного аккаунта есть нужные права
- Проверьте квоты в Yandex Cloud

## 📊 МОНИТОРИНГ

### Логи в Vercel:
1. **Dashboard → Functions → /api/generate**
2. **Просмотр логов в реальном времени**
3. **Анализ ошибок и производительности**

### Мониторинг БД:
- Проверяйте создание пользователей
- Отслеживайте генерации контента
- Мониторьте использование квот

## 🎉 ГОТОВО!

После выполнения всех шагов:
- ✅ Проект очищен от лишних файлов
- ✅ Настроены переменные окружения
- ✅ База данных работает
- ✅ Yandex GPT интегрирован
- ✅ Сайт работает на Vercel
- ✅ Регистрация и генерация функционируют

**Ваш проект Graphly теперь работает в продакшене!** 🚀
