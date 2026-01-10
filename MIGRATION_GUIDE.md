# 🚀 Guide de Migration v3.0 - Raven Industries Frontend

## 📋 Vue d'ensemble

Ce guide vous accompagne dans l'intégration des nouvelles fonctionnalités v3.0 dans votre application.

---

## ⚡ Quick Start (5 minutes)

### 1. Configuration de base

```bash
# 1. Mettre à jour les variables d'environnement
cp .env.example .env.local
```

```env
# .env.local - Ajouter ces lignes
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
```

### 2. Activer PWA dans le layout

```typescript
// src/app/layout.tsx
import { usePWA } from '@/lib/pwa';

export default function RootLayout({ children }) {
  // Appeler le hook PWA
  usePWA();
  
  return (
    <html>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Remplacer la recherche existante

```typescript
// Dans votre Header.tsx
import { LiveSearch } from '@/components/search/LiveSearch';

// Remplacer l'ancien composant par:
<LiveSearch placeholder="Rechercher un produit..." />
```

### 4. Utiliser les images optimisées

```typescript
// Au lieu de <img>
import { ProductImage } from '@/components/ui/optimized-image';

<ProductImage
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
/>
```

**Bravo ! Votre app est maintenant PWA avec recherche optimisée et images performantes. 🎉**

---

## 📦 Intégration par fonctionnalité

### 1. Système de Cache

#### Cas d'usage: Cacher les catégories

```typescript
// src/app/layout.tsx ou page.tsx
import { cache } from '@/lib/cache';

async function getCategories() {
  return cache.getOrSet(
    'categories',
    async () => {
      const res = await fetch('/ravenapi/categories');
      return res.json();
    },
    {
      strategy: 'localStorage',
      ttl: 10 * 60 * 1000, // 10 minutes
    }
  );
}
```

#### Cas d'usage: Hook dans un composant

```typescript
// src/components/CategoryList.tsx
'use client';

import { useCachedData } from '@/lib/cache';

export function CategoryList() {
  const { data, loading, error } = useCachedData(
    'categories',
    () => fetch('/ravenapi/categories').then(r => r.json()),
    { ttl: 10 * 60 * 1000 }
  );

  if (loading) return <CategoryListSkeleton />;
  if (error) return <div>Erreur</div>;
  
  return <div>{data.map(...)}</div>;
}
```

#### Cas d'usage: Invalidation cache panier

```typescript
// src/contexts/CartContext.tsx
import { cache } from '@/lib/cache';

const addToCart = async (product) => {
  await fetch('/ravenapi/cart/add', ...);
  
  // Invalider le cache panier
  cache.delete('cart', { strategy: 'localStorage' });
  
  // Ou invalider tous les caches panier
  cache.invalidatePattern('cart.*');
};
```

---

### 2. Skeleton Loaders

#### Remplacer les loaders existants

```typescript
// Avant
{loading && <div>Chargement...</div>}

// Après
import { ProductGridSkeleton } from '@/components/ui/skeleton';

{loading && <ProductGridSkeleton count={12} />}
```

#### Page produit

```typescript
// src/app/product/[slug]/loading.tsx
import { ProductDetailSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return <ProductDetailSkeleton />;
}
```

#### Liste catégories

```typescript
// src/app/category/[slug]/page.tsx
import { ProductGridSkeleton } from '@/components/ui/skeleton';

export default async function CategoryPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductList />
    </Suspense>
  );
}
```

---

### 3. Progressive Web App (PWA)

#### Configuration complète

```typescript
// src/app/layout.tsx
'use client';

import { usePWA, useInstallPrompt } from '@/lib/pwa';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  // Enregistrer le service worker
  usePWA();
  
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}

// Composant d'installation PWA
function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt();
  
  if (!canInstall) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={promptInstall}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        📱 Installer l'application
      </button>
    </div>
  );
}
```

#### Notifications Push

```typescript
// src/app/compte/notifications/page.tsx
'use client';

import { usePushNotifications } from '@/lib/pwa';

export default function NotificationsPage() {
  const {
    permission,
    requestPermission,
    subscribe,
    unsubscribe,
    isSubscribed
  } = usePushNotifications();
  
  return (
    <div>
      <h2>Notifications Push</h2>
      
      {permission === 'default' && (
        <button onClick={requestPermission}>
          Activer les notifications
        </button>
      )}
      
      {permission === 'granted' && !isSubscribed && (
        <button onClick={subscribe}>
          S'abonner aux notifications
        </button>
      )}
      
      {isSubscribed && (
        <>
          <p>✓ Notifications activées</p>
          <button onClick={unsubscribe}>
            Se désabonner
          </button>
        </>
      )}
    </div>
  );
}
```

#### Préparer les icônes

```bash
# Créer les icônes nécessaires dans public/images/
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png (obligatoire)
- icon-384x384.png
- icon-512x512.png (obligatoire)
- search-icon.png
- account-icon.png
- cart-icon.png
```

---

### 4. Google Analytics 4

#### Intégrer dans le layout

```typescript
// src/app/layout.tsx
import { Analytics } from '@/components/analytics/Analytics';
import Script from 'next/script';

export default function RootLayout({ children }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  return (
    <html>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
```

#### Tracker les événements dans CartContext

```typescript
// src/contexts/CartContext.tsx
import {
  trackAddToCart,
  trackRemoveFromCart,
  trackViewCart
} from '@/lib/analytics';

const addToCart = (product) => {
  // ... logique ajout panier
  
  // Tracker GA4
  trackAddToCart({
    id: product.id.toString(),
    name: product.name,
    brand: product.manufacturer,
    category: product.category_name,
    price: product.price,
    quantity: 1
  });
};

const removeFromCart = (product) => {
  // ... logique retrait
  
  trackRemoveFromCart({
    id: product.id.toString(),
    name: product.name,
    price: product.price,
    quantity: 1
  });
};
```

#### Tracker les pages produit

```typescript
// src/app/product/[slug]/page.tsx
'use client';

import { trackViewItem } from '@/lib/analytics';
import { useEffect } from 'react';

export default function ProductPage({ product }) {
  useEffect(() => {
    trackViewItem({
      id: product.id.toString(),
      name: product.name,
      brand: product.manufacturer,
      category: product.category_name,
      price: product.price
    });
  }, [product]);
  
  return <div>...</div>;
}
```

#### Tracker le checkout

```typescript
// src/app/checkout/page.tsx
import { trackBeginCheckout, trackPurchase } from '@/lib/analytics';

// Début checkout
useEffect(() => {
  if (cart.products.length > 0) {
    trackBeginCheckout(
      cart.products.map(p => ({
        id: p.id.toString(),
        name: p.name,
        price: p.price,
        quantity: p.quantity
      })),
      cart.totals.total_price
    );
  }
}, []);

// Après paiement réussi
const handlePaymentSuccess = (orderId) => {
  trackPurchase({
    transaction_id: orderId,
    value: cart.totals.total_price,
    currency: 'EUR',
    tax: cart.totals.total_tax,
    shipping: cart.totals.total_shipping,
    items: cart.products.map(p => ({
      id: p.id.toString(),
      name: p.name,
      price: p.price,
      quantity: p.quantity
    }))
  });
};
```

---

### 5. Live Search

#### Intégration dans Header

```typescript
// src/components/layout/Header.tsx
import { LiveSearch } from '@/components/search/LiveSearch';

export function Header() {
  return (
    <header>
      <div className="container">
        <Logo />
        
        {/* Desktop search */}
        <div className="hidden md:block flex-1 mx-8">
          <LiveSearch 
            placeholder="Rechercher un produit..."
            debounceDelay={300}
            minSearchLength={2}
            maxResults={8}
          />
        </div>
        
        {/* Mobile search */}
        <div className="md:hidden w-full mt-4">
          <LiveSearchCompact 
            placeholder="Recherche..."
            maxResults={5}
          />
        </div>
        
        <UserActions />
      </div>
    </header>
  );
}
```

#### Endpoint API pour la recherche

```php
// modules/ravenapi/controllers/front/search.php
class RavenApiSearchModuleFrontController extends ModuleFrontController
{
    public function initContent()
    {
        $query = Tools::getValue('q');
        $limit = (int)Tools::getValue('limit', 8);
        
        if (strlen($query) < 2) {
            $this->ajaxRender(json_encode(['products' => []]));
            return;
        }
        
        $products = Product::searchByName($this->context->language->id, $query);
        $results = [];
        
        foreach (array_slice($products, 0, $limit) as $product) {
            $p = new Product($product['id_product'], true, $this->context->language->id);
            $results[] = [
                'id' => $p->id,
                'name' => $p->name,
                'reference' => $p->reference,
                'price' => $p->getPrice(true),
                'image' => $this->context->link->getImageLink($p->link_rewrite, $p->id_default_image),
                'category' => $p->category,
                'url' => $this->context->link->getProductLink($p),
            ];
        }
        
        $this->ajaxRender(json_encode(['products' => $results]));
    }
}
```

---

### 6. Optimisation Images

#### Configuration Next.js

```typescript
// next.config.ts - Fusionner avec la config existante
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ravenindustries.fr',
        pathname: '/img/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
```

#### Remplacer les images produit

```typescript
// Avant
<img 
  src={product.image} 
  alt={product.name}
  className="w-full h-full object-cover"
/>

// Après
import { ProductImage } from '@/components/ui/optimized-image';

<ProductImage
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
  priority={index < 4} // Priority pour les 4 premiers
/>
```

#### Galerie produit

```typescript
// src/app/product/[slug]/ProductGallery.tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

export function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  
  return (
    <div>
      {/* Image principale */}
      <OptimizedImage
        src={selectedImage.url}
        alt={selectedImage.alt}
        width={800}
        height={800}
        priority
        className="w-full rounded-lg"
      />
      
      {/* Vignettes */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {images.map((img, i) => (
          <ThumbnailImage
            key={i}
            src={img.url}
            alt={img.alt}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 Tests de validation

### 1. Test PWA

```bash
# Chrome DevTools
1. Ouvrir DevTools (F12)
2. Application > Manifest
   ✓ Vérifier que manifest.json est chargé
3. Application > Service Workers
   ✓ Vérifier que sw.js est actif
4. Lighthouse > Progressive Web App
   ✓ Score > 90
```

### 2. Test Offline

```bash
# Chrome DevTools
1. Application > Service Workers > Offline
2. Rafraîchir la page
   ✓ Page offline s'affiche
3. Aller sur une page déjà visitée
   ✓ Contenu en cache s'affiche
```

### 3. Test Analytics

```bash
# Google Analytics
1. Analytics > Real-time > Events
2. Ajouter un produit au panier
   ✓ Événement 'add_to_cart' apparaît
3. Rechercher un produit
   ✓ Événement 'search' avec term
```

### 4. Test Cache

```javascript
// Console navigateur
// Vérifier localStorage
console.log(localStorage.getItem('raven_cache_categories'));

// Vérifier expiration
cache.set('test', 'value', { ttl: 1000 }); // 1 seconde
setTimeout(() => console.log(cache.get('test')), 2000); // null
```

### 5. Test Images

```bash
# Network tab
1. Ouvrir DevTools > Network
2. Filtrer par "Img"
3. Vérifier formats:
   ✓ WebP ou AVIF (navigateurs modernes)
   ✓ Tailles adaptées au device
   ✓ Cache-Control: max-age
```

---

## 🚀 Déploiement Production

### 1. Build

```bash
npm run build
```

### 2. Vérifications pré-déploiement

- [ ] Variables d'environnement configurées
- [ ] Icônes PWA présentes dans `/public/images/`
- [ ] Service Worker fonctionne en HTTPS
- [ ] GA_MEASUREMENT_ID configuré
- [ ] next.config avec images optimisées

### 3. Déploiement

```bash
# Build production
npm run build

# Lancer
npm start

# Ou avec PM2
pm2 restart next-frontend
pm2 save
```

### 4. Post-déploiement

- [ ] Tester installation PWA sur mobile
- [ ] Vérifier événements GA4 en temps réel
- [ ] Tester mode offline
- [ ] Vérifier images optimisées (WebP/AVIF)
- [ ] Lighthouse score > 90

---

## 📊 Monitoring

### Métriques à surveiller

```javascript
// Performance
- Time to Interactive (TTI): < 3s
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s

// Cache
- Hit ratio: > 50%
- Miss ratio: < 50%
- Avg response time: < 100ms

// Analytics
- Conversion rate: Baseline + tracking
- Cart abandonment: Tracking précis
- Search effectiveness: Terms → conversions
```

---

## 🐛 Troubleshooting

### PWA non installable

**Problème**: Bouton install n'apparaît pas

**Solutions**:
1. Vérifier HTTPS actif (requis PWA)
2. Vérifier manifest.json accessible
3. Vérifier icônes 192x192 et 512x512
4. Vérifier service worker enregistré
5. Chrome: chrome://flags → Enable PWA

### Cache ne fonctionne pas

**Problème**: Données pas mises en cache

**Solutions**:
1. Vérifier localStorage disponible (mode privé?)
2. Vérifier TTL pas expiré
3. Vérifier prefix correct
4. Console: `cache.get('key', { strategy: 'localStorage' })`

### Images non optimisées

**Problème**: Images lourdes non converties

**Solutions**:
1. Vérifier next.config.optimized.ts utilisé
2. Vérifier build production (`npm run build`)
3. Vérifier domaines dans remotePatterns
4. Vérifier composant OptimizedImage utilisé

### Analytics ne track pas

**Problème**: Événements n'apparaissent pas dans GA

**Solutions**:
1. Vérifier NEXT_PUBLIC_GA_MEASUREMENT_ID
2. Console: `window.dataLayer` doit exister
3. Désactiver Ad Blockers
4. Vérifier Real-time reports (pas Overview)
5. Attendre 24-48h pour rapports complets

---

## 📚 Ressources supplémentaires

- [Documentation Cache](/FEATURES_GUIDE.md#1-système-de-cache)
- [Documentation PWA](https://web.dev/progressive-web-apps/)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Image](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Service Workers](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API)

---

**Support**: Pour toute question, consultez FEATURES_GUIDE.md ou ouvrez une issue GitHub.

**Version**: 3.0.0  
**Date**: 2026-01-10  
**Auteur**: Raven Industries Development Team
