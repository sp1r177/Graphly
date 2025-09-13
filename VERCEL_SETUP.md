# Настройка переменных окружения в Vercel

## Проблема
При деплое возникает ошибка: `Missing Supabase environment variables`

## Решение

### 1. Перейдите в Vercel Dashboard
1. Откройте ваш проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект Graphly
3. Перейдите в Settings > Environment Variables

### 2. Добавьте переменные окружения
Добавьте следующие переменные:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production, Preview, Development |

### 3. Где найти значения

#### NEXT_PUBLIC_SUPABASE_URL
1. Откройте ваш Supabase проект
2. Перейдите в Settings > API
3. Скопируйте "Project URL"

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
1. В том же разделе Settings > API
2. Скопируйте "anon public" ключ

#### NEXT_PUBLIC_SITE_URL
1. Используйте URL вашего Vercel проекта
2. Например: `https://graphly-abc123.vercel.app`

### 4. Передеплой
После добавления переменных:
1. Перейдите в Deployments
2. Нажмите "Redeploy" на последнем деплое
3. Или сделайте новый коммит в GitHub

## Проверка
После настройки переменных:
1. Регистрация должна работать
2. Email подтверждение должно приходить
3. Вход в систему должен работать

## Альтернативное решение (временное)
Если нужно быстро запустить без Supabase, можно временно отключить аутентификацию, закомментировав проверки в `src/lib/auth.ts`.
