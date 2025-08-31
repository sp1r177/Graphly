/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    esmExternals: false,
  },
  // Принудительно отключаем ESLint
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'eslint': false,
      };
    }
    return config;
  },
  // Настройки для Prisma
  env: {
    PRISMA_GENERATE_DATAPROXY: 'true',
  },
}

export default nextConfig;
