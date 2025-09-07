@echo off
echo ========================================
echo    AIКонтент - ИСПРАВЛЕНИЕ ПРИЛОЖЕНИЯ
echo ========================================
echo.

echo [1/3] Добавление изменений...
git add .

echo.
echo [2/3] Создание коммита...
git commit -m "Fix registration and generation - use mock content"

echo.
echo [3/3] Отправка на GitHub...
git push

echo.
echo ========================================
echo    ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!
echo ========================================
echo.
echo Теперь приложение должно работать:
echo 1. Регистрация будет работать
echo 2. Генерация контента будет работать (мок)
echo 3. Заглушки исчезнут
echo.
echo Проверьте через 2-3 минуты:
echo https://graphly-five.vercel.app
echo.
pause
