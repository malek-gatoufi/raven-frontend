/**
 * Google Analytics 4 Integration
 * Tracking des événements e-commerce et comportement utilisateur
 */

// Types pour les événements GA4
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface GAProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: number;
  quantity?: number;
}

export interface GATransaction {
  transaction_id: string;
  value: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items: GAProduct[];
}

// Déclaration des types pour gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Initialise Google Analytics
 */
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Créer le script GA4
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialiser dataLayer et gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
    send_page_view: true,
  });
};

/**
 * Track un événement personnalisé
 */
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Track une page view
 */
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
    page_path: url,
  });
};

/**
 * E-commerce Events
 */

/**
 * Track vue d'un produit
 */
export const trackViewItem = (product: GAProduct) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: 'EUR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        item_variant: product.variant,
        price: product.price,
        quantity: product.quantity || 1,
      },
    ],
  });
};

/**
 * Track ajout au panier
 */
export const trackAddToCart = (product: GAProduct) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: (product.price || 0) * (product.quantity || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        item_variant: product.variant,
        price: product.price,
        quantity: product.quantity || 1,
      },
    ],
  });
};

/**
 * Track retrait du panier
 */
export const trackRemoveFromCart = (product: GAProduct) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'remove_from_cart', {
    currency: 'EUR',
    value: (product.price || 0) * (product.quantity || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        item_variant: product.variant,
        price: product.price,
        quantity: product.quantity || 1,
      },
    ],
  });
};

/**
 * Track vue du panier
 */
export const trackViewCart = (products: GAProduct[], totalValue: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_cart', {
    currency: 'EUR',
    value: totalValue,
    items: products.map((product) => ({
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand,
      item_category: product.category,
      item_variant: product.variant,
      price: product.price,
      quantity: product.quantity || 1,
    })),
  });
};

/**
 * Track début du checkout
 */
export const trackBeginCheckout = (
  products: GAProduct[],
  totalValue: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value: totalValue,
    items: products.map((product) => ({
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand,
      item_category: product.category,
      item_variant: product.variant,
      price: product.price,
      quantity: product.quantity || 1,
    })),
  });
};

/**
 * Track ajout d'informations de paiement
 */
export const trackAddPaymentInfo = (
  products: GAProduct[],
  totalValue: number,
  paymentType: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_payment_info', {
    currency: 'EUR',
    value: totalValue,
    payment_type: paymentType,
    items: products.map((product) => ({
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand,
      item_category: product.category,
      item_variant: product.variant,
      price: product.price,
      quantity: product.quantity || 1,
    })),
  });
};

/**
 * Track achat (conversion)
 */
export const trackPurchase = (transaction: GATransaction) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: transaction.transaction_id,
    value: transaction.value,
    currency: transaction.currency,
    tax: transaction.tax,
    shipping: transaction.shipping,
    items: transaction.items.map((product) => ({
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand,
      item_category: product.category,
      item_variant: product.variant,
      price: product.price,
      quantity: product.quantity || 1,
    })),
  });
};

/**
 * Track recherche
 */
export const trackSearch = (searchTerm: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
  });
};

/**
 * Track ajout à la wishlist
 */
export const trackAddToWishlist = (product: GAProduct) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_to_wishlist', {
    currency: 'EUR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        item_variant: product.variant,
        price: product.price,
        quantity: product.quantity || 1,
      },
    ],
  });
};

/**
 * Track inscription
 */
export const trackSignUp = (method: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'sign_up', {
    method: method,
  });
};

/**
 * Track connexion
 */
export const trackLogin = (method: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'login', {
    method: method,
  });
};

/**
 * Track partage
 */
export const trackShare = (contentType: string, itemId: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'share', {
    content_type: contentType,
    item_id: itemId,
  });
};
