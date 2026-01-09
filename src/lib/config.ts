/**
 * Configuration API PrestaShop
 * Utilise le module ravenapi pour les endpoints REST
 */

// Déterminer l'URL selon l'environnement
const getApiBaseUrl = () => {
  // Côté client
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';
  }
  // Côté serveur (SSR/SSG) - utiliser l'URL interne si disponible
  return process.env.PRESTASHOP_INTERNAL_URL || process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';
};

export const API_CONFIG = {
  // URL de base du PrestaShop
  get baseUrl() {
    return getApiBaseUrl();
  },
  
  // Clé webservice (si besoin)
  webserviceKey: process.env.PRESTASHOP_WEBSERVICE_KEY || '',
  
  // Helper pour construire les URLs ravenapi
  buildUrl: (controller: string, params?: Record<string, string | number | boolean>) => {
    const base = `${getApiBaseUrl()}/index.php?fc=module&module=ravenapi&controller=${controller}`;
    if (!params) return base;
    
    const queryParams = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    return queryParams ? `${base}&${queryParams}` : base;
  },
  
  // Endpoints format ravenapi
  endpoints: {
    products: 'products',
    product: 'product',
    categories: 'categories',
    category: 'category',
    cart: 'cart',
    checkout: 'checkout',
    auth: 'auth',
    customer: 'customer',
    orders: 'orders',
    order: 'order',
    addresses: 'addresses',
    search: 'search',
    manufacturers: 'manufacturers',
  }
};

export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Raven Industries',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Pièces détachées moto, quad, jet-ski, motoneige',
  currency: 'EUR',
  locale: 'fr-FR',
  slogan: "L'équipement qui fait la différence",
};
