@echo off
echo ========================================
echo    AIКонтент - Деплой исправлений
echo ========================================
echo.

echo [1/3] Добавление файлов в Git...
git add .
if %errorlevel% neq 0 (
    echo Ошибка при добавлении файлов!
    pause
    exit /b 1
)

echo.
echo [2/3] Создание коммита...
git commit -m "Add diagnostic tests for debugging"
if %errorlevel% neq 0 (
    echo Ошибка при создании коммита!
    pause
    exit /b 1
)

echo.
echo [3/3] Отправка на GitHub...
git push
if %errorlevel% neq 0 (
    echo Ошибка при отправке на GitHub!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Деплой завершен!
echo ========================================
echo.
echo Теперь проверьте эти ссылки:
echo 1. https://your-app.vercel.app/api/real-test
echo 2. https://your-app.vercel.app/api/db-test
echo 3. https://your-app.vercel.app/api/generate-test
echo.
echo Эти тесты покажут, в чем именно проблема!
echo.
pause
