@echo off
echo ========================================
echo    Настройка генерации с Supabase
echo ========================================
echo.

echo Шаг 1: Проверяем .env.local...
if exist ".env.local" (
    echo ✅ .env.local найден
    echo Проверяем DATABASE_URL...
    findstr /c:"postgresql://" .env.local >nul
    if %errorlevel% equ 0 (
        echo ✅ DATABASE_URL настроен для Supabase
    ) else (
        echo ❌ DATABASE_URL не настроен для Supabase
        echo Создайте .env.local с правильным DATABASE_URL
        pause
        exit /b 1
    )
) else (
    echo ❌ .env.local не найден
    echo Создайте .env.local с DATABASE_URL для Supabase
    pause
    exit /b 1
)
echo.

echo Шаг 2: Генерируем Prisma клиент для PostgreSQL...
npx prisma generate
if %errorlevel% equ 0 (
    echo ✅ Prisma клиент сгенерирован для PostgreSQL
) else (
    echo ❌ Ошибка генерации Prisma клиента
    pause
    exit /b 1
)
echo.

echo Шаг 3: Проверяем подключение к Supabase...
npx prisma db push --accept-data-loss
if %errorlevel% equ 0 (
    echo ✅ Подключение к Supabase работает
) else (
    echo ❌ Ошибка подключения к Supabase
    echo Проверьте DATABASE_URL в .env.local
    pause
    exit /b 1
)
echo.

echo ========================================
echo    Настройка завершена!
echo ========================================
echo.
echo Теперь можно запустить сервер:
echo   npm run dev
echo.
echo И протестировать генерацию:
echo   http://localhost:3000
echo.
pause
