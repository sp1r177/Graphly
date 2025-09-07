@echo off
echo ========================================
echo    AIКонтент - Быстрый деплой
echo ========================================
echo.

echo [1/2] Добавление изменений...
git add . && git commit -m "Add quick test endpoint" && git push

echo.
echo ========================================
echo    Деплой завершен!
echo ========================================
echo.
echo Проверьте: https://graphly-five.vercel.app/api/quick-test
echo.
pause
