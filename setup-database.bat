@echo off
echo ========================================
echo    НАСТРОЙКА БАЗЫ ДАННЫХ GRAPHY
echo ========================================
echo.

echo Шаг 1: Переключение на локальную схему (SQLite)...
node switch-db.js local
if %errorlevel% neq 0 (
    echo ❌ Ошибка переключения схемы
    echo Попробуйте вручную: copy prisma\schema.local.prisma prisma\schema.prisma
) else (
    echo ✅ Схема переключена на SQLite
)
echo.

echo Шаг 2: Генерация Prisma клиента...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Ошибка генерации Prisma клиента
) else (
    echo ✅ Prisma клиент сгенерирован
)
echo.

echo Шаг 3: Создание/обновление базы данных...
npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Ошибка создания базы данных
    echo Проверьте переменные окружения в .env.local
) else (
    echo ✅ База данных создана/обновлена
)
echo.

echo Шаг 4: Проверка базы данных...
if exist "prisma\dev.db" (
    echo ✅ Файл базы данных найден: prisma\dev.db
    dir prisma\dev.db
) else (
    echo ❌ Файл базы данных не найден
)
echo.

echo ========================================
echo    БАЗА ДАННЫХ ГОТОВА!
echo ========================================
echo.
echo Теперь:
echo 1. Запустите сервер: npm run dev
echo 2. Протестируйте регистрацию
echo 3. Проверьте генерацию контента
echo.
pause
