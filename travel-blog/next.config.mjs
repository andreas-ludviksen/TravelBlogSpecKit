/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for production deployment to Cloudflare Pages
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Skip build-time validation for dynamic routes (will be client-side rendered)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
