@echo off
echo ========================================
echo    AIКонтент - Исправление ошибок
echo ========================================
echo.

echo [1/4] Проверка файлов...
if not exist .env.local (
    echo Создание файла .env.local...
    echo # Supabase Database > .env.local
    echo DATABASE_URL="postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres" >> .env.local
    echo. >> .env.local
    echo # Supabase API Keys >> .env.local
    echo SUPABASE_URL="https://tlorolxxxyztzrjlsjbwi.supabase.co" >> .env.local
    echo SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3JvbHh4eXp0cnpqbHNqYndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5OTQsImV4cCI6MjA3Mjc3Mjk5NH0.GyGKbEOyjHynaAskHEZnamcTAkoY-C3_sFO_Y_1IX5M" >> .env.local
    echo. >> .env.local
    echo # JWT Secret >> .env.local
    echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production" >> .env.local
    echo. >> .env.local
    echo # Yandex GPT API >> .env.local
    echo YANDEX_GPT_API_KEY="your-yandex-gpt-api-key-here" >> .env.local
    echo YANDEX_GPT_FOLDER_ID="your-yandex-folder-id-here" >> .env.local
    echo YANDEX_GPT_API_URL="https://llm.api.cloud.yandex.net/foundationModels/v1/completion" >> .env.local
    echo. >> .env.local
    echo # Next.js >> .env.local
    echo NEXTAUTH_URL="http://localhost:3000" >> .env.local
    echo NEXTAUTH_SECRET="your-nextauth-secret-here" >> .env.local
    echo. >> .env.local
    echo # Environment >> .env.local
    echo NODE_ENV="development" >> .env.local
    echo ✅ Файл .env.local создан!
) else (
    echo ✅ Файл .env.local уже существует
)

echo.
echo [2/4] Переключение на PostgreSQL схему...
node switch-db.js production
if %errorlevel% neq 0 (
    echo ❌ Ошибка при переключении схемы!
    echo Запустите вручную: node switch-db.js production
)

echo.
echo [3/4] Генерация Prisma клиента...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Ошибка при генерации Prisma клиента!
    echo Запустите вручную: npx prisma generate
)

echo.
echo [4/4] Применение схемы к базе данных...
npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Ошибка при применении схемы!
    echo Проверьте DATABASE_URL в .env.local
    echo Запустите вручную: npx prisma db push
)

echo.
echo ========================================
echo    Исправление завершено!
echo ========================================
echo.
echo 📋 СЛЕДУЮЩИЕ ШАГИ:
echo 1. Получите пароль БД из Supabase
echo 2. Замените [ВАШ_ПАРОЛЬ] в .env.local
echo 3. Запустите: npm run dev
echo 4. Откройте: http://localhost:3000
echo.
echo 📖 Подробные инструкции: FIX_ERRORS.md
echo.
pause
