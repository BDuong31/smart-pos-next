// next.config.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5003',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.localhost',
        port: '3000',
        pathname: '/**',
      },
            {
        protocol: 'https',
        hostname: 'baso.id.vn',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'admin.baso.id.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      { 
        protocol: 'https',
        hostname: 'via.placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-baso-spark.up.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true, 
  },
};

export default nextConfig;