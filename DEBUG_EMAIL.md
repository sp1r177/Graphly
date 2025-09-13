# 🔍 Диагностика отправки email

## Шаги для проверки:

### 1. Проверьте переменные окружения
Откройте `/test-email` и попробуйте отправить тестовое письмо.

### 2. Проверьте логи в Vercel
1. Vercel Dashboard → Functions → View Function Logs
2. Найдите логи от `/api/auth/send-confirmation`
3. Посмотрите что показывает `console.log`

### 3. Проверьте переменные в Vercel
Убедитесь что добавлены:
```
UNISENDER_API_KEY = ваш_ключ
UNISENDER_SENDER_EMAIL = noreply@yourdomain.com
SITE_URL = https://your-domain.vercel.app
```

### 4. Проверьте API ключ UniSender
1. Зайдите в UniSender
2. Убедитесь что API ключ активен
3. Проверьте лимиты отправки

## Возможные проблемы:

### ❌ "UniSender not configured"
- Не добавлена переменная `UNISENDER_API_KEY`
- Переменная добавлена неправильно

### ❌ "Failed to send email"
- Неправильный API ключ
- Превышен лимит отправки
- Неправильный email отправителя

### ❌ Письмо не приходит
- Проверьте папку "Спам"
- Проверьте правильность email адреса
- Проверьте настройки UniSender

## 🚀 После исправления:
1. Redeploy проект
2. Попробуйте регистрацию
3. Проверьте email

**Скажите что показывает тестовая страница `/test-email`!**
