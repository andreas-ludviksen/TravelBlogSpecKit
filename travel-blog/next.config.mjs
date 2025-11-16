/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export for local development/testing
  // Re-enable for production deployment to Cloudflare Pages
  // output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
