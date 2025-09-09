// Проверка переменных окружения
// Запустите: node check-env.js

console.log('🔍 Проверка переменных окружения...');
console.log('');

const requiredVars = [
  'YANDEX_API_KEY',
  'YANDEX_FOLDER_ID', 
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXT_PUBLIC_BASE_URL'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: НЕ НАЙДЕН`);
    allPresent = false;
  }
});

console.log('');
if (allPresent) {
  console.log('🎉 Все переменные окружения настроены!');
} else {
  console.log('⚠️  Некоторые переменные отсутствуют. Добавьте их в Vercel Dashboard.');
}
