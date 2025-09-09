@echo off
echo ========================================
echo    Настройка Graphly для локальной разработки
echo ========================================
echo.

echo Шаг 1: Создание .env.local...
if not exist ".env.local" (
    copy env.local.ready .env.local
    echo ✅ .env.local создан
) else (
    echo ✅ .env.local уже существует
)
echo.

echo Шаг 2: Переключение на локальную схему БД...
if exist "switch-db.js" (
    node switch-db.js local
    echo ✅ Схема переключена на SQLite
) else (
    echo ⚠️  switch-db.js не найден
)
echo.

echo Шаг 3: Генерация Prisma клиента...
npx prisma generate
echo ✅ Prisma клиент сгенерирован
echo.

echo Шаг 4: Создание/обновление базы данных...
npx prisma db push
echo ✅ База данных готова
echo.

echo ========================================
echo    Настройка завершена!
echo ========================================
echo.
echo Теперь запустите приложение:
echo   npm run dev
echo.
echo Проверьте работу:
echo   http://localhost:3000/api/generate
echo   http://localhost:3000/auth/register
echo.
pause
