@echo off
echo ========================================
echo    AIКонтент - Простой деплой
echo ========================================
echo.

echo [1/3] Добавление файлов...
git add .

echo.
echo [2/3] Создание коммита...
git commit -m "Add simple test endpoint"

echo.
echo [3/3] Отправка на GitHub...
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
