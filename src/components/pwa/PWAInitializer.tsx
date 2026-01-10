'use client';

import { usePWA } from '@/lib/pwa';
import { useEffect } from 'react';

/**
 * Composant client pour initialiser le PWA
 * À utiliser dans le RootLayout
 */
export function PWAInitializer() {
  usePWA();
  
  useEffect(() => {
    // Log PWA status in development
    if (process.env.NODE_ENV === 'development') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          console.log('✅ PWA Service Worker ready');
        });
      }
    }
  }, []);

  return null;
}
