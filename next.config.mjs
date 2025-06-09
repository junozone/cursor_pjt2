/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress specific hydration warnings
  reactStrictMode: true,
  compiler: {
    // Suppress specific hydration warnings
    reactRemoveProperties: { properties: ['^data-__embeded-gyazo-content-j-s$', '^data-__gyazo-expander-enabled$'] }
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

export default nextConfig
