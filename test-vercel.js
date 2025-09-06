// Тест переменных окружения для Vercel
console.log('🔍 Тест переменных окружения Vercel')
console.log('=====================================')

console.log('\n📋 Ваши переменные:')
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅' : '❌')
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅' : '❌')
console.log('YANDEX_CLOUD_ID:', process.env.YANDEX_CLOUD_ID ? '✅' : '❌')
console.log('YANDEX_FOLDER_ID:', process.env.YANDEX_FOLDER_ID ? '✅' : '❌')
console.log('YANDEX_API_KEY:', process.env.YANDEX_API_KEY ? '✅' : '❌')
console.log('YANDEX_GPT_MODEL:', process.env.YANDEX_GPT_MODEL ? '✅' : '❌')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅' : '❌')
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅' : '❌')

console.log('\n❌ Отсутствующие переменные:')
if (!process.env.NEXTAUTH_SECRET) console.log('- NEXTAUTH_SECRET')
if (!process.env.NODE_ENV) console.log('- NODE_ENV')

console.log('\n💡 Рекомендации:')
console.log('1. Добавьте NEXTAUTH_SECRET в Vercel')
console.log('2. Добавьте NODE_ENV=production в Vercel')
console.log('3. Проверьте, что DATABASE_URL содержит правильный пароль')
console.log('4. Перезапустите деплой в Vercel')
