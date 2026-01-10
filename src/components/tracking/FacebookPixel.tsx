'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Facebook Pixel Integration
 * Tracking pour retargeting et audiences personnalisées
 */
export default function FacebookPixel() {
  useEffect(() => {
    // Votre Pixel ID (à remplacer par le vôtre)
    const pixelId = '1234567890123456'; // REMPLACER PAR VOTRE PIXEL ID

    // Initialize Facebook Pixel
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    if (window.fbq) {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }

    return () => {
      // Cleanup si nécessaire
    };
  }, []);

  return null;
}

/**
 * Track product view
 */
export const fbTrackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      content_category: product.category || 'Uncategorized',
      value: product.price,
      currency: 'EUR',
    });
  }
};

/**
 * Track add to cart
 */
export const fbTrackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * (product.quantity || 1),
      currency: 'EUR',
    });
  }
};

/**
 * Track begin checkout
 */
export const fbTrackInitiateCheckout = (cart: { total: number; itemCount: number }) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'InitiateCheckout', {
      value: cart.total,
      currency: 'EUR',
      num_items: cart.itemCount,
    });
  }
};

/**
 * Track purchase
 */
export const fbTrackPurchase = (order: {
  id: string;
  total: number;
  items: Array<{ id: string; quantity: number }>;
}) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'Purchase', {
      value: order.total,
      currency: 'EUR',
      content_ids: order.items.map((item) => item.id),
      content_type: 'product',
      transaction_id: order.id,
    });
  }
};

/**
 * Track search
 */
export const fbTrackSearch = (searchTerm: string) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'Search', {
      search_string: searchTerm,
    });
  }
};

/**
 * Track lead (newsletter, contact)
 */
export const fbTrackLead = (method: string = 'newsletter') => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'Lead', {
      content_name: method,
    });
  }
};

/**
 * Track add to wishlist
 */
export const fbTrackAddToWishlist = (product: {
  id: string;
  name: string;
  price: number;
}) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'AddToWishlist', {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: 'EUR',
    });
  }
};
