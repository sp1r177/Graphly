// УЛЬТИМАТИВНЫЙ СКРИПТ ДИАГНОСТИКИ И ИСПРАВЛЕНИЯ ПРОБЛЕМ ГЕНЕРАЦИИ
const fs = require('fs');
const path = require('path');

console.log('🔥 УЛЬТИМАТИВНАЯ ДИАГНОСТИКА ГЕНЕРАЦИИ КОНТЕНТА\n');
console.log('=' .repeat(60));

let problems = [];
let fixes = [];

// 1. Проверка наличия файлов
console.log('📁 ШАГ 1: Проверка файловой структуры...');
const requiredFiles = [
    '.env.local',
    'src/app/api/generate/route.ts',
    'package.json',
    'prisma/schema.prisma'
];

requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) {
        problems.push(`Файл ${file} не найден`);
        fixes.push(`Создать файл: ${file}`);
    }
});

// 2. Проверка переменных окружения
console.log('\n🔧 ШАГ 2: Проверка переменных окружения...');
if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];

    requiredVars.forEach(varName => {
        const exists = envContent.includes(varName);
        console.log(`${exists ? '✅' : '❌'} ${varName}`);
        if (!exists) {
            problems.push(`Переменная ${varName} не найдена в .env.local`);
            fixes.push(`Добавить в .env.local: ${varName}=...`);
        }
    });
} else {
    problems.push('Файл .env.local не найден');
    fixes.push('Создать .env.local из env.local.ready');
}

// 3. Проверка API роута
console.log('\n🔌 ШАГ 3: Проверка API роута...');
if (fs.existsSync('src/app/api/generate/route.ts')) {
    const apiContent = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');
    const hasPOST = apiContent.includes('export async function POST');
    const hasGenerate = apiContent.includes('generateContent');
    const hasMock = apiContent.includes('generateMockContent');

    console.log(`${hasPOST ? '✅' : '❌'} Функция POST`);
    console.log(`${hasGenerate ? '✅' : '❌'} Функция generateContent`);
    console.log(`${hasMock ? '✅' : '❌'} Функция generateMockContent`);

    if (!hasPOST) {
        problems.push('API роут не имеет функции POST');
        fixes.push('Проверить src/app/api/generate/route.ts');
    }
} else {
    problems.push('API роут не найден');
    fixes.push('Создать src/app/api/generate/route.ts');
}

// 4. Проверка зависимостей
console.log('\n📦 ШАГ 4: Проверка зависимостей...');
if (fs.existsSync('package.json')) {
    const pkgContent = fs.readFileSync('package.json', 'utf8');
    const deps = ['next', 'prisma', '@prisma/client'];

    deps.forEach(dep => {
        const exists = pkgContent.includes(`"${dep}"`);
        console.log(`${exists ? '✅' : '❌'} ${dep}`);
        if (!exists) {
            problems.push(`Зависимость ${dep} не найдена`);
            fixes.push(`npm install ${dep}`);
        }
    });
}

// 5. Резюме и действия
console.log('\n' + '=' .repeat(60));
console.log('📊 РЕЗУЛЬТАТЫ ДИАГНОСТИКИ:');

if (problems.length === 0) {
    console.log('✅ ВСЕ СИСТЕМЫ РАБОТАЮТ!');
    console.log('\n🚀 ДЕЙСТВИЯ:');
    console.log('1. npm run dev');
    console.log('2. Открыть http://localhost:3000');
    console.log('3. Протестировать генерацию');
    console.log('4. Проверить логи в терминале');
} else {
    console.log(`❌ НАЙДЕНО ${problems.length} ПРОБЛЕМ:`);
    problems.forEach((problem, i) => {
        console.log(`${i + 1}. ${problem}`);
    });

    console.log('\n🔧 НЕОБХОДИМЫЕ ИСПРАВЛЕНИЯ:');
    fixes.forEach((fix, i) => {
        console.log(`${i + 1}. ${fix}`);
    });

    console.log('\n🚀 АВТОМАТИЧЕСКИЕ ИСПРАВЛЕНИЯ:');

    // Предлагаем автоматические исправления
    if (!fs.existsSync('.env.local') && fs.existsSync('env.local.ready')) {
        console.log('• Создать .env.local из env.local.ready');
    }

    if (!fs.existsSync('prisma/dev.db')) {
        console.log('• Настроить базу данных: npx prisma db push');
    }

    console.log('• Перезапустить сервер: npm run dev');
}

// 6. Быстрые тесты
console.log('\n🧪 БЫСТРЫЕ ТЕСТЫ:');
console.log('• Тест API: node test-api-direct.js');
console.log('• Тест в браузере: test-browser.html');
console.log('• Переключение API: switch-api.bat simple/complex');

console.log('\n📞 ЕСЛИ ПРОБЛЕМЫ ОСТАЮТСЯ:');
console.log('1. Очистите кеш: rm -rf .next && npm run build');
console.log('2. Переустановите зависимости: rm -rf node_modules && npm install');
console.log('3. Проверьте логи: npm run dev 2>&1 | tee debug.log');

console.log('\n' + '=' .repeat(60));
console.log('🎯 ГОТОВО К ЗАПУСКУ!');
