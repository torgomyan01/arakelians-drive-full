import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем проверку ESLint во время production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем проверку TypeScript во время production build (опционально)
    ignoreBuildErrors: false,
  },
  experimental: {
    esmExternals: true,
    serverActions: {},
  },
  env: {
    // NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  transpilePackages: ['@mep-agency/next-iubenda'],
  reactStrictMode: true,
  sassOptions: {
    additionalData: ``,
    includePaths: [path.join(__dirname, 'src/access/css')],
  },
  trailingSlash: false,
  async redirects() {
    return [];
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: '',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
