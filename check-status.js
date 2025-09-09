// Проверка статуса системы
// Запустите: node check-status.js

console.log('🔍 Проверка статуса Graphly...\n');

const fs = require('fs');
const path = require('path');

// Проверка файлов
const filesToCheck = [
  '.env.local',
  'prisma/schema.prisma',
  'prisma/dev.db',
  'src/app/api/generate/route.ts',
  'src/app/api/auth/register/route.ts'
];

console.log('📁 Проверка файлов:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🔧 Проверка переменных окружения:');
const envVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'YANDEX_API_KEY',
  'YANDEX_FOLDER_ID',
  'NODE_ENV'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ Найден' : '❌ Не найден';
  const preview = value ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : '';
  console.log(`${status} ${varName}: ${preview}`);
});

console.log('\n💡 Рекомендации:');
if (!fs.existsSync('.env.local')) {
  console.log('- Создайте .env.local из env.local.ready');
}
if (!fs.existsSync('prisma/dev.db')) {
  console.log('- Запустите: npx prisma db push');
}
if (!process.env.JWT_SECRET) {
  console.log('- Добавьте JWT_SECRET в .env.local');
}

console.log('\n🚀 Для запуска: npm run dev');
console.log('📊 Для проверки API: http://localhost:3000/api/generate');
