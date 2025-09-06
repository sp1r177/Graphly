@echo off
echo ========================================
echo    AIКонтент - Настройка с Supabase
echo ========================================
echo.
echo 🆓 Supabase - полностью бесплатный PostgreSQL БЕЗ КАРТЫ!
echo.

echo [1/4] Установка зависимостей...
call npm install
if %errorlevel% neq 0 (
    echo Ошибка при установке зависимостей!
    pause
    exit /b 1
)

echo.
echo [2/4] Генерация Prisma клиента...
call npx prisma generate
if %errorlevel% neq 0 (
    echo Ошибка при генерации Prisma клиента!
    pause
    exit /b 1
)

echo.
echo [3/4] Создание файла .env...
if not exist .env (
    echo Создание файла .env...
    echo # Supabase Database (БЕЗ КАРТЫ!) > .env
    echo # Получите строку подключения на https://supabase.com/ > .env
    echo # Settings → Database → Connection string → URI > .env
    echo DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" >> .env
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
    echo ✅ Файл .env создан!
    echo.
    echo 📋 СЛЕДУЮЩИЕ ШАГИ:
    echo 1. Зайдите на https://supabase.com/
    echo 2. Войдите через GitHub
    echo 3. Создайте новый проект
    echo 4. Скопируйте Connection String
    echo 5. Замените DATABASE_URL в файле .env
    echo 6. Добавьте ваши API ключи Yandex GPT
    echo.
) else (
    echo Файл .env уже существует.
)

echo.
echo [4/4] Переключение на PostgreSQL схему...
call npm run db:production
if %errorlevel% neq 0 (
    echo Ошибка при переключении схемы!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Настройка завершена!
echo ========================================
echo.
echo 🆓 Supabase - полностью бесплатно!
echo 📊 500MB базы данных
echo 👥 50,000 пользователей
echo 🔄 500,000 запросов в месяц
echo.
echo Следующие шаги:
echo 1. Настройте Supabase (https://supabase.com/)
echo 2. Обновите DATABASE_URL в .env
echo 3. Добавьте API ключи Yandex GPT
echo 4. Запустите: npm run dev
echo.
echo 📖 Подробные инструкции: SUPABASE_SETUP.md
echo.
pause
