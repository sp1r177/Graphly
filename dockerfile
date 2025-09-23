# Строим приложение
FROM node:20-alpine AS build
WORKDIR /app

# Скопируем зависимости
COPY package*.json ./

# Установим зависимости
RUN npm install

# Скопируем весь проект
COPY . .

# Сборка
RUN npm run build

# Финальный образ
FROM node:20-alpine
WORKDIR /app

# Скопируем всё из сборочного контейнера
COPY --from=build /app ./

EXPOSE 3000

# Запуск Next.js
CMD ["sh", "-c", "npx next start -p 3000 -H 0.0.0.0"]
