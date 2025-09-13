@echo off
echo ========================================
echo    Настройка генерации контента
echo ========================================
echo.

echo Шаг 1: Проверяем .env.local...
if exist ".env.local" (
    echo ✅ .env.local найден
) else (
    echo ❌ .env.local не найден
    echo Создаем из env.local.ready...
    copy env.local.ready .env.local
    echo ✅ .env.local создан
)
echo.

echo Шаг 2: Переключаемся на локальную схему...
copy prisma\schema.local.prisma prisma\schema.prisma
echo ✅ Схема переключена на SQLite
echo.

echo Шаг 3: Генерируем Prisma клиент...
npx prisma generate
if %errorlevel% equ 0 (
    echo ✅ Prisma клиент сгенерирован
) else (
    echo ❌ Ошибка генерации Prisma клиента
    pause
    exit /b 1
)
echo.

echo Шаг 4: Создаем базу данных...
npx prisma db push
if %errorlevel% equ 0 (
    echo ✅ База данных создана
) else (
    echo ❌ Ошибка создания базы данных
    pause
    exit /b 1
)
echo.

echo Шаг 5: Проверяем базу данных...
if exist "prisma\dev.db" (
    echo ✅ Файл базы данных prisma\dev.db создан
) else (
    echo ❌ Файл базы данных не найден
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
echo   debug-generation.bat
echo.
pause
