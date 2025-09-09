@echo off
echo ========================================
echo    ЗАПУСК ВСЕХ ТЕСТОВ GRAPHY
echo ========================================
echo.

echo Шаг 1: Проверка файлов...
if exist ".env.local" (
    echo ✅ .env.local найден
) else (
    echo ❌ .env.local не найден
    echo Создайте его из env.local.ready
)

if exist "prisma\dev.db" (
    echo ✅ База данных найдена
) else (
    echo ❌ База данных не найдена
    echo Запустите: npx prisma db push
)
echo.

echo Шаг 2: Запуск диагностики...
if exist "ultimate-fix.js" (
    echo Запуск полной диагностики...
    node ultimate-fix.js
) else (
    echo ❌ ultimate-fix.js не найден
)
echo.

echo Шаг 3: Тест полного цикла...
if exist "test-full-flow.js" (
    echo.
    echo Запуск теста полного цикла...
    node test-full-flow.js
) else (
    echo ❌ test-full-flow.js не найден
)
echo.

echo ========================================
echo    РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ
echo ========================================
echo.
echo Если тесты прошли успешно:
echo 1. Откройте test-auth-and-generate.html в браузере
echo 2. Протестируйте регистрацию и генерацию
echo.
echo Если есть ошибки:
echo 1. Проверьте логи выше
echo 2. Запустите npm run dev
echo 3. Проверьте .env.local
echo.
pause
