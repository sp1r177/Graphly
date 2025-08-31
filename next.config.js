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
}

module.exports = nextConfig