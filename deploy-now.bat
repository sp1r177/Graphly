@echo off
echo ========================================
echo    AIКонтент - Быстрый деплой
echo ========================================
echo.

echo [1/2] Добавление изменений...
git add .
git commit -m "Add debug logging to generate API"
git push

echo.
echo ========================================
echo    Деплой завершен!
echo ========================================
echo.
echo Проверьте: https://graphly-five.vercel.app/api/generate
echo.
pause
