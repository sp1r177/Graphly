@echo off
echo ========================================
echo    AIКонтент - Деплой файлов
echo ========================================
echo.

echo [1/4] Проверка статуса...
git status --porcelain

echo.
echo [2/4] Добавление всех файлов...
git add .

echo.
echo [3/4] Создание коммита...
git commit -m "Add diagnostic API endpoints"

echo.
echo [4/4] Отправка на GitHub...
git push

echo.
echo ========================================
echo    Деплой завершен!
echo ========================================
echo.
echo Проверьте через 2-3 минуты:
echo https://graphly-five.vercel.app/api/test
echo.
pause
