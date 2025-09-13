const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Настройка базы данных для генерации контента...\n');

try {
  // Проверяем, есть ли .env.local
  if (!fs.existsSync('.env.local')) {
    console.log('❌ .env.local не найден');
    console.log('💡 Создайте его из env.local.ready');
    process.exit(1);
  }

  console.log('✅ .env.local найден');

  // Генерируем Prisma клиент
  console.log('🔧 Генерируем Prisma клиент...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma клиент сгенерирован');

  // Создаем базу данных
  console.log('🗄️ Создаем базу данных...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ База данных создана');

  // Проверяем, что файл базы данных создан
  if (fs.existsSync('prisma/dev.db')) {
    console.log('✅ Файл базы данных prisma/dev.db создан');
  } else {
    console.log('❌ Файл базы данных не найден');
  }

  console.log('\n🎉 Настройка базы данных завершена!');
  console.log('💡 Теперь можно запустить сервер: npm run dev');

} catch (error) {
  console.error('❌ Ошибка при настройке базы данных:', error.message);
  process.exit(1);
}
