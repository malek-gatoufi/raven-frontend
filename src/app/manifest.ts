import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Raven Industries',
    short_name: 'Raven',
    description: 'Spécialiste de la pièce détachée pour moto, quad, jet-ski et motoneige',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#44D92C',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'fr',
    categories: ['shopping', 'sports'],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '1280x720',
        type: 'image/png',
        // @ts-ignore - form_factor n'est pas dans le type mais est valide
        form_factor: 'wide',
        label: 'Page d\'accueil Raven Industries',
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '750x1334',
        type: 'image/png',
        // @ts-ignore
        form_factor: 'narrow',
        label: 'Vue mobile',
      },
    ],
    shortcuts: [
      {
        name: 'Rechercher',
        short_name: 'Recherche',
        description: 'Rechercher des produits',
        url: '/recherche',
        icons: [{ src: '/icons/search.png', sizes: '96x96' }],
      },
      {
        name: 'Mon Panier',
        short_name: 'Panier',
        description: 'Voir votre panier',
        url: '/panier',
        icons: [{ src: '/icons/cart.png', sizes: '96x96' }],
      },
      {
        name: 'Mon Compte',
        short_name: 'Compte',
        description: 'Accéder à votre compte',
        url: '/compte',
        icons: [{ src: '/icons/account.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
