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
  // Настройки для предотвращения ошибок загрузки чанков
  generateBuildId: async () => {
    // Используем timestamp для уникального build ID
    return `build-${Date.now()}`;
  },
  // Принудительно отключаем ESLint
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'eslint': false,
      };
    }
    
    // Настройки для лучшей обработки чанков
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  // Настройки для Prisma
  env: {
    PRISMA_GENERATE_DATAPROXY: 'true',
  },
}

export default nextConfig;
