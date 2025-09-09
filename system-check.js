// Полная проверка системы Graphly
const fs = require('fs');
const path = require('path');

console.log('🔍 Полная диагностика системы Graphly\n');

let issues = [];
let warnings = [];

// 1. Проверка файлов
console.log('📁 1. Проверка файлов:');
const filesToCheck = [
  '.env.local',
  'prisma/schema.prisma',
  'prisma/dev.db',
  'src/app/api/generate/route.ts',
  'src/app/api/auth/register/route.ts',
  'package.json'
];

filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists && file !== 'prisma/dev.db') {
    issues.push(`Файл ${file} не найден`);
  }
});

// 2. Проверка переменных окружения
console.log('\n🔧 2. Проверка переменных окружения:');
const envPath = '.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {
    'DATABASE_URL': envContent.includes('DATABASE_URL'),
    'JWT_SECRET': envContent.includes('JWT_SECRET'),
    'NODE_ENV': envContent.includes('NODE_ENV')
  };

  Object.entries(envVars).forEach(([key, exists]) => {
    console.log(`${exists ? '✅' : '❌'} ${key}`);
    if (!exists) {
      issues.push(`Переменная ${key} не найдена в .env.local`);
    }
  });
} else {
  console.log('❌ .env.local не найден');
  issues.push('Файл .env.local не найден');
}

// 3. Проверка package.json
console.log('\n📦 3. Проверка зависимостей:');
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const deps = {
    'next': packageContent.includes('"next"'),
    'prisma': packageContent.includes('"prisma"'),
    '@prisma/client': packageContent.includes('"prisma/client"')
  };

  Object.entries(deps).forEach(([key, exists]) => {
    console.log(`${exists ? '✅' : '❌'} ${key}`);
    if (!exists) {
      issues.push(`Зависимость ${key} не найдена`);
    }
  });
} else {
  console.log('❌ package.json не найден');
  issues.push('Файл package.json не найден');
}

// 4. Проверка API роута
console.log('\n🔌 4. Проверка API роута:');
const apiPath = 'src/app/api/generate/route.ts';
if (fs.existsSync(apiPath)) {
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  const apiChecks = {
    'export async function POST': apiContent.includes('export async function POST'),
    'generateContent function': apiContent.includes('async function generateContent'),
    'generateMockContent function': apiContent.includes('async function generateMockContent')
  };

  Object.entries(apiChecks).forEach(([key, exists]) => {
    console.log(`${exists ? '✅' : '❌'} ${key}`);
    if (!exists) {
      issues.push(`API роут: ${key} не найден`);
    }
  });
} else {
  console.log('❌ API роут не найден');
  issues.push('Файл API роута не найден');
}

// 5. Рекомендации
console.log('\n📋 5. Результаты диагностики:');

if (issues.length === 0) {
  console.log('✅ Система готова к запуску!');
  console.log('\n🚀 Следующие шаги:');
  console.log('1. npm install');
  console.log('2. npm run dev');
  console.log('3. Открыть http://localhost:3000');
  console.log('4. Протестировать генерацию контента');
} else {
  console.log(`❌ Найдено ${issues.length} проблем:`);
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });

  console.log('\n🔧 Рекомендации по исправлению:');
  console.log('1. Создайте .env.local из env.local.ready');
  console.log('2. Выполните: npx prisma generate && npx prisma db push');
  console.log('3. Проверьте наличие всех файлов');
  console.log('4. Перезапустите сервер');
}

if (warnings.length > 0) {
  console.log('\n⚠️  Предупреждения:');
  warnings.forEach(warning => {
    console.log(`- ${warning}`);
  });
}

console.log('\n🎯 Для быстрой проверки генерации: node test-generation.js');
console.log('📊 Для полной диагностики: node system-check.js');
