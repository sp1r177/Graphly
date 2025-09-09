@echo off
echo ========================================
echo    Проверка переменных окружения
echo ========================================
echo.

echo Проверяем .env.local файл...
if exist .env.local (
    echo ✅ .env.local найден
    echo.
    echo Содержимое .env.local:
    echo ----------------------------------------
    type .env.local
    echo ----------------------------------------
) else (
    echo ❌ .env.local не найден
    echo.
    echo Создайте .env.local из env.local.template:
    echo copy env.local.template .env.local
)

echo.
echo Проверяем переменные в коде...
echo.

echo Поиск упоминаний Hugging Face в коде:
findstr /r /i "hugging.*face" src\app\api\generate\route.ts
if %errorlevel% equ 0 (
    echo ❌ Найдены упоминания Hugging Face в коде
) else (
    echo ✅ Hugging Face не найден в коде
)

echo.
echo Поиск упоминаний Yandex в коде:
findstr /r /i "yandex" src\app\api\generate\route.ts
if %errorlevel% equ 0 (
    echo ✅ Yandex найден в коде
) else (
    echo ❌ Yandex не найден в коде
)

echo.
echo ========================================
echo    Рекомендации:
echo ========================================
echo.
echo 1. Создайте .env.local из env.local.template
echo 2. Добавьте ваши API ключи Yandex Cloud
echo 3. Обновите переменные в Vercel Dashboard
echo 4. Протестируйте: npm run dev
echo.
pause
