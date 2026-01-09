import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone pour Docker production
  output: 'standalone',
  
  // Configuration des images distantes (PrestaShop)
  // Les images sont servies sans optimisation Next.js car le domaine résout en IP privée
  images: {
    unoptimized: true,
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
