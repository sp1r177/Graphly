const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma')
const localSchemaPath = path.join(__dirname, 'prisma', 'schema.local.prisma')
const backupPath = path.join(__dirname, 'prisma', 'schema.backup.prisma')

function switchToLocal() {
  try {
    // Backup current schema
    if (fs.existsSync(schemaPath)) {
      fs.copyFileSync(schemaPath, backupPath)
      console.log('✅ Текущая схема сохранена в schema.backup.prisma')
    }

    // Copy local schema
    fs.copyFileSync(localSchemaPath, schemaPath)
    console.log('✅ Переключено на локальную схему (SQLite)')
    console.log('💡 Теперь используйте: npm run db:push')
  } catch (error) {
    console.error('❌ Ошибка при переключении на локальную схему:', error.message)
  }
}

function switchToProduction() {
  try {
    // Restore from backup
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, schemaPath)
      console.log('✅ Переключено на продакшн схему (PostgreSQL)')
      console.log('💡 Теперь используйте: npm run db:push')
    } else {
      console.log('❌ Файл backup не найден. Создайте схему для продакшена вручную.')
    }
  } catch (error) {
    console.error('❌ Ошибка при переключении на продакшн схему:', error.message)
  }
}

const command = process.argv[2]

switch (command) {
  case 'local':
    switchToLocal()
    break
  case 'production':
    switchToProduction()
    break
  default:
    console.log('Использование:')
    console.log('  node switch-db.js local      - Переключиться на SQLite (локальная разработка)')
    console.log('  node switch-db.js production - Переключиться на PostgreSQL (продакшн)')
    console.log('')
    console.log('Текущая схема:', fs.existsSync(schemaPath) ? 'schema.prisma' : 'не найдена')
}
