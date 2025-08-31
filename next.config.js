/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Настройки для Vercel
  output: 'standalone',
  poweredByHeader: false,
  // Дополнительные настройки для игнорирования ESLint
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig