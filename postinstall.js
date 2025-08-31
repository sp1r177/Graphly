const { execSync } = require('child_process');

try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.warn('Warning: Failed to generate Prisma client:', error.message);
  console.log('Continuing with build...');
  // Не выходим с ошибкой, продолжаем сборку
}
