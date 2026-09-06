/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // Prevent Hostinger OOM errors during build type-checking
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevent linting failures from killing the production build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'bcryptjs'];
    return config;
  },
};

module.exports = nextConfig;
