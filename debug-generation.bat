@echo off
echo ========================================
echo    Отладка генерации контента
echo ========================================
echo.

echo Шаг 1: Проверяем .env.local...
if exist ".env.local" (
    echo ✅ .env.local найден
    type .env.local | findstr /c:"DATABASE_URL" /c:"JWT_SECRET" /c:"YANDEX_API_KEY" /c:"YANDEX_FOLDER_ID"
) else (
    echo ❌ .env.local не найден
    echo Создайте его из env.local.ready
)
echo.

echo Шаг 2: Проверяем базу данных...
if exist "prisma\dev.db" (
    echo ✅ База данных SQLite найдена
) else (
    echo ❌ База данных не найдена
    echo Запустите: npx prisma db push
)
echo.

echo Шаг 3: Проверяем API endpoint...
curl -s http://localhost:3000/api/generate | findstr "status"
if %errorlevel% equ 0 (
    echo ✅ API работает
) else (
    echo ❌ API не отвечает
    echo Запустите: npm run dev
)
echo.

echo Шаг 4: Тестируем генерацию...
curl -s -X POST http://localhost:3000/api/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"Тест\",\"templateType\":\"VK_POST\"}" | findstr "text"
if %errorlevel% equ 0 (
    echo ✅ Генерация работает
) else (
    echo ❌ Генерация не работает
)
echo.

echo ========================================
echo    Результаты диагностики
echo ========================================
echo.
echo Если что-то помечено ❌ - исправьте и попробуйте снова.
echo.
pause
