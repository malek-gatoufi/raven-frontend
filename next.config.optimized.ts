/**
 * Configuration optimisée pour les images Next.js
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration des images
  images: {
    // Domaines autorisés pour les images externes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ravenindustries.fr',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ravenindustries.fr',
        pathname: '/img/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
    // Formats d'images modernes supportés
    formats: ['image/avif', 'image/webp'],
    // Tailles d'images prédéfinies pour l'optimisation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache des images optimisées (1 an)
    minimumCacheTTL: 31536000,
    // Désactiver la génération d'images statiques (peut causer des problèmes de build)
    unoptimized: false,
  },

  // Configuration du cache
  experimental: {
    // Utiliser le nouveau système de cache
    optimizeCss: true,
  },

  // Compression
  compress: true,

  // Configuration PWA
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
      // Cache pour les assets statiques
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Manifest PWA
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
