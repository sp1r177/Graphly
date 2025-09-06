@echo off
echo ========================================
echo    AIКонтент - Быстрая настройка
echo ========================================
echo.

echo [1/3] Переключение на PostgreSQL схему...
node switch-db.js production
if %errorlevel% neq 0 (
    echo Ошибка при переключении схемы!
    pause
    exit /b 1
)

echo.
echo [2/3] Генерация Prisma клиента...
npx prisma generate
if %errorlevel% neq 0 (
    echo Ошибка при генерации Prisma клиента!
    pause
    exit /b 1
)

echo.
echo [3/3] Создание файла .env...
echo # Supabase Database > .env
echo DATABASE_URL="postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres" >> .env
echo. >> .env
echo # Supabase API Keys >> .env
echo SUPABASE_URL="https://tlorolxxxyztzrjlsjbwi.supabase.co" >> .env
echo SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3JvbHh4eXp0cnpqbHNqYndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5OTQsImV4cCI6MjA3Mjc3Mjk5NH0.GyGKbEOyjHynaAskHEZnamcTAkoY-C3_sFO_Y_1IX5M" >> .env
echo. >> .env
echo # JWT Secret >> .env
echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production" >> .env
echo. >> .env
echo # Yandex GPT API >> .env
echo YANDEX_GPT_API_KEY="your-yandex-gpt-api-key-here" >> .env
echo YANDEX_GPT_FOLDER_ID="your-yandex-folder-id-here" >> .env
echo YANDEX_GPT_API_URL="https://llm.api.cloud.yandex.net/foundationModels/v1/completion" >> .env
echo. >> .env
echo # Next.js >> .env
echo NEXTAUTH_URL="http://localhost:3000" >> .env
echo NEXTAUTH_SECRET="your-nextauth-secret-here" >> .env
echo. >> .env
echo # Environment >> .env
echo NODE_ENV="development" >> .env

echo.
echo ========================================
echo    Настройка завершена!
echo ========================================
echo.
echo 📋 СЛЕДУЮЩИЕ ШАГИ:
echo 1. Зайдите на https://supabase.com/dashboard
echo 2. Войдите в проект tlorolxxxyztzrjlsjbwi
echo 3. Settings → Database → Database Password
echo 4. Сгенерируйте пароль (если нет)
echo 5. Замените [ВАШ_ПАРОЛЬ] в файле .env
echo 6. Запустите: npm run db:push
echo 7. Запустите: npm run dev
echo.
echo 📖 Подробные инструкции: SUPABASE_CONFIG.md
echo.
pause
