/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  output: 'standalone',
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  // Configure for Replit environment
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  async rewrites() {
    // In Replit, backend runs on localhost:8000, accessible via server-side rewrites
    const backendUrl = 'http://localhost:8000';
    
    console.log('[Next.js Config] Backend URL:', backendUrl);
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};
module.exports = nextConfig;