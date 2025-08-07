/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['firebasestorage.googleapis.com'],
    },
    allowedDevOrigins: ['http://localhost:3001'],
  };
  
  module.exports = nextConfig;
  
  module.exports = {
    // other config...
    matcher: ['/admin/:path*'],
  };
  