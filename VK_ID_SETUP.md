# Настройка VK ID авторизации

## Переменные окружения

Добавьте следующие переменные в ваш `.env.local` файл:

```bash
# VK ID Configuration (серверные переменные)
VK_CLIENT_ID=your_vk_client_id
VK_CLIENT_SECRET=your_vk_client_secret
VK_REDIRECT_URI=https://yourdomain.com/auth/vk/callback

# VK ID Configuration (клиентские переменные - только Client ID)
NEXT_PUBLIC_VK_CLIENT_ID=your_vk_client_id
```

## Настройка в VK ID

1. Перейдите в [VK ID Developer Console](https://dev.vk.com/api/vk-id)
2. Создайте новое приложение
3. Настройте параметры:
   - **Название**: Ваше название приложения
   - **Домен**: Ваш домен (например: `yourdomain.com`)
   - **Redirect URI**: `https://yourdomain.com/auth/vk/callback`
4. Скопируйте `Client ID` и `Client Secret`

## Настройка домена

1. В настройках приложения VK ID добавьте ваш домен
2. Убедитесь, что домен подтвержден
3. Настройте SSL сертификат для вашего домена

## Проверка работы

1. Запустите приложение: `npm run dev`
2. Перейдите на страницу входа или регистрации
3. Нажмите кнопку "Войти через VK ID"
4. Должна открыться страница авторизации VK
5. После успешной авторизации пользователь будет перенаправлен в личный кабинет

## Возможные проблемы

### Ошибка "Invalid redirect_uri"
- Проверьте, что `VK_REDIRECT_URI` точно соответствует настройкам в VK ID
- Убедитесь, что используется HTTPS для production

### Ошибка "Client not found"
- Проверьте правильность `VK_CLIENT_ID`
- Убедитесь, что приложение активно в VK ID

### Ошибка "Access denied"
- Пользователь отклонил разрешения
- Это нормальное поведение, пользователь может попробовать снова
