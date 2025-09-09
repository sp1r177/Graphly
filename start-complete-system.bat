@echo off
echo ========================================
echo    ЗАПУСК ПОЛНОЙ СИСТЕМЫ GRAPHY
echo    С БАЗОЙ ДАННЫХ И АВТОРИЗАЦИЕЙ
echo ========================================
echo.

echo Шаг 1: Проверка переменных окружения...
if exist ".env.local" (
    echo ✅ .env.local найден
) else (
    echo ❌ .env.local не найден, создаем...
    if exist "env.local.ready" (
        copy env.local.ready .env.local
        echo ✅ .env.local создан из шаблона
    ) else (
        echo ❌ env.local.ready не найден!
        echo Создайте .env.local вручную
    )
)
echo.

echo Шаг 2: Настройка базы данных...
call setup-database.bat
echo.

echo Шаг 3: Установка зависимостей...
npm install
echo.

echo Шаг 4: Запуск сервера разработки...
echo.
echo ========================================
echo    СИСТЕМА ЗАПУЩЕНА!
echo ========================================
echo.
echo Сервер запущен на: http://localhost:3000
echo.
echo Для тестирования:
echo 1. Откройте: http://localhost:3000
echo 2. Зарегистрируйтесь или войдите
echo 3. Протестируйте генерацию контента
echo.
echo Или используйте тестовую страницу:
echo Откройте: test-auth-and-generate.html
echo.
echo Для остановки сервера: Ctrl+C
echo.

npm run dev
