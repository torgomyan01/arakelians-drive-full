import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем проверку ESLint во время production build
    ignoreDuringBuilds: true,
  },
  metadataBase: new URL('https://arakelians-drive.am/'),
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
