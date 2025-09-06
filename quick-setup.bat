@echo off
echo ========================================
echo    AIКонтент - Быстрая настройка
echo ========================================
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
echo [3/4] Создание базы данных...
call npx prisma db push
if %errorlevel% neq 0 (
    echo Ошибка при создании базы данных!
    pause
    exit /b 1
)

echo.
echo [4/4] Проверка файла .env...
if not exist .env (
    echo Создание файла .env...
    echo # Database > .env
    echo DATABASE_URL="file:./dev.db" >> .env
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
    echo Файл .env создан! Не забудьте добавить ваши API ключи.
) else (
    echo Файл .env уже существует.
)

echo.
echo ========================================
echo    Настройка завершена!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Отредактируйте файл .env и добавьте ваши API ключи Yandex GPT
echo 2. Запустите: npm run dev
echo 3. Откройте: http://localhost:3000
echo.
echo Для получения API ключей Yandex GPT:
echo https://console.cloud.yandex.ru/
echo.
pause
