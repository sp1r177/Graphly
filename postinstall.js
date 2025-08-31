const { execSync } = require('child_process');

try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Failed to generate Prisma client:', error);
  process.exit(1);
}
