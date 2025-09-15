# Диагностика Yandex GPT

## 🔍 Проверка конфигурации

### 1. Проверьте переменные окружения
Откройте в браузере: `https://your-domain.vercel.app/api/debug/yandex-config`

Этот эндпоинт покажет:
- Какие переменные найдены
- Какие переменные отсутствуют
- Рекомендации по исправлению

### 2. Тест работы Yandex GPT
Откройте в браузере: `https://your-domain.vercel.app/api/test-yandex-gpt`

Этот эндпоинт:
- Попытается сгенерировать тестовый контент
- Покажет ошибки, если они есть
- Покажет количество использованных токенов

## 🚨 Частые проблемы

### Проблема 1: "API ключ не найден"
**Решение:**
1. Убедитесь, что в Vercel добавлена переменная `YANDEX_API_KEY`
2. Проверьте, что значение не пустое
3. Перезапустите деплой после добавления переменной

### Проблема 2: "Folder ID не найден"
**Решение:**
1. Убедитесь, что в Vercel добавлена переменная `YANDEX_FOLDER_ID`
2. Folder ID должен быть в формате: `b1g2h3j4k5l6m7n8o9p0`
3. Получите правильный Folder ID в Yandex Cloud Console

### Проблема 3: "Operation failed" или "Timeout"
**Решение:**
1. Проверьте правильность API ключа
2. Убедитесь, что у вас есть доступ к Yandex GPT
3. Проверьте лимиты в Yandex Cloud Console

### Проблема 4: "Unauthorized" или "403 Forbidden"
**Решение:**
1. Проверьте права доступа API ключа
2. Убедитесь, что API ключ имеет права на Yandex GPT
3. Проверьте, что папка (folder) существует

## 🔧 Пошаговая диагностика

### Шаг 1: Проверьте переменные
```bash
# В Vercel Dashboard -> Settings -> Environment Variables
# Должны быть:
YANDEX_API_KEY=your-api-key
YANDEX_FOLDER_ID=your-folder-id
```

### Шаг 2: Проверьте API ключ
1. Откройте Yandex Cloud Console
2. Перейдите в "IAM" -> "Сервисные аккаунты"
3. Убедитесь, что у аккаунта есть роль "ai.languageModels.user"

### Шаг 3: Проверьте Folder ID
1. В Yandex Cloud Console найдите ID папки
2. Он должен быть в формате: `b1g2h3j4k5l6m7n8o9p0`
3. Убедитесь, что папка активна

### Шаг 4: Проверьте доступ к Yandex GPT
1. В Yandex Cloud Console перейдите в "AI и машинное обучение"
2. Выберите "YandexGPT"
3. Убедитесь, что сервис доступен

## 📊 Мониторинг

### Логи в Vercel
1. Откройте Vercel Dashboard
2. Перейдите в "Functions" -> "Logs"
3. Ищите ошибки с "Yandex GPT"

### Логи в Yandex Cloud
1. Откройте Yandex Cloud Console
2. Перейдите в "Observability" -> "Logs"
3. Фильтруйте по "yandexgpt"

## 🆘 Если ничего не помогает

### 1. Проверьте все переменные
```bash
curl https://your-domain.vercel.app/api/debug/yandex-config
```

### 2. Проверьте тест
```bash
curl https://your-domain.vercel.app/api/test-yandex-gpt
```

### 3. Проверьте логи
- Vercel Functions Logs
- Yandex Cloud Logs
- Browser Console (F12)

### 4. Создайте новый API ключ
1. Удалите старый API ключ
2. Создайте новый с правильными правами
3. Обновите переменную в Vercel
4. Перезапустите деплой

## 📞 Поддержка

Если проблема не решается:
1. Проверьте документацию Yandex Cloud
2. Обратитесь в поддержку Yandex Cloud
3. Проверьте статус сервисов Yandex Cloud
