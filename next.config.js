/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
};

module.exports = nextConfig;