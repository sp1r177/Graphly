@echo off
echo ========================================
echo    AIКонтент - Деплой на Vercel
echo ========================================
echo.

echo [1/3] Добавление изменений в Git...
git add .
if %errorlevel% neq 0 (
    echo Ошибка при добавлении файлов в Git!
    pause
    exit /b 1
)

echo.
echo [2/3] Создание коммита...
git commit -m "Fix environment variables and add logging"
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
echo Vercel автоматически задеплоит изменения.
echo Проверьте: https://your-app.vercel.app/api/test-env
echo.
pause
