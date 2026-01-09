'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronLeft, ChevronRight, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/prestashop';

const MAX_RECENT_PRODUCTS = 12;
const STORAGE_KEY = 'recentlyViewedProducts';

interface RecentProduct {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  oldPrice?: number;
  viewedAt: number;
}

interface RecentlyViewedContextType {
  products: RecentProduct[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  clearAll: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null);

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as RecentProduct[];
        // Filter out old items (older than 30 days)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const filtered = parsed.filter(p => p.viewedAt > thirtyDaysAgo);
        setProducts(filtered);
      } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  const addProduct = useCallback((product: Product) => {
    const recentProduct: RecentProduct = {
      id: product.id,
      name: product.name,
      slug: `${product.id}-${product.link_rewrite}`,
      image: product.cover_image || null,
      price: product.price,
      oldPrice: product.price_without_reduction > product.price ? product.price_without_reduction : undefined,
      viewedAt: Date.now()
    };

    setProducts(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.id !== product.id);
      // Add at the beginning
      const updated = [recentProduct, ...filtered];
      // Limit to max items
      return updated.slice(0, MAX_RECENT_PRODUCTS);
    });
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearAll = useCallback(() => {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ products, addProduct, removeProduct, clearAll }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

// Product Card for recently viewed
interface RecentProductCardProps {
  product: RecentProduct;
  onRemove?: () => void;
}

function RecentProductCard({ product, onRemove }: RecentProductCardProps) {
  const discount = product.oldPrice 
    ? Math.round((1 - product.price / product.oldPrice) * 100) 
    : 0;

  return (
    <div className="group relative flex-shrink-0 w-[160px] bg-[#1a1a1a]/50 rounded-xl overflow-hidden border border-white/5 hover:border-[#44D92C]/30 transition-all duration-300">
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-1 right-1 z-10 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Retirer"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}

      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
          -{discount}%
        </div>
      )}

      <Link href={`/product/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square bg-white/5">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2">
          <p className="text-xs text-white font-medium line-clamp-2 min-h-[32px]">
            {product.name}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#44D92C]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Carousel component
interface RecentlyViewedCarouselProps {
  title?: string;
  excludeProductId?: number;
  showClearButton?: boolean;
  className?: string;
}

export function RecentlyViewedCarousel({
  title = "Récemment consultés",
  excludeProductId,
  showClearButton = false,
  className
}: RecentlyViewedCarouselProps) {
  const { products, removeProduct, clearAll } = useRecentlyViewed();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Filter out current product
  const displayProducts = excludeProductId 
    ? products.filter(p => p.id !== excludeProductId)
    : products;

  useEffect(() => {
    if (containerRef) {
      const updateMaxScroll = () => {
        setMaxScroll(containerRef.scrollWidth - containerRef.clientWidth);
      };
      updateMaxScroll();
      window.addEventListener('resize', updateMaxScroll);
      return () => window.removeEventListener('resize', updateMaxScroll);
    }
  }, [containerRef, displayProducts]);

  if (displayProducts.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef) return;
    const scrollAmount = 340; // 2 cards
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(maxScroll, scrollPosition + scrollAmount);
    
    containerRef.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  return (
    <div className={cn("py-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#44D92C]" />
          <h3 className="text-lg font-bold">{title}</h3>
          <span className="text-sm text-gray-500">
            ({displayProducts.length})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {showClearButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-gray-400 hover:text-red-500"
            >
              Tout effacer
            </Button>
          )}

          {/* Navigation arrows */}
          {maxScroll > 0 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30"
                onClick={() => scroll('left')}
                disabled={scrollPosition <= 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30"
                onClick={() => scroll('right')}
                disabled={scrollPosition >= maxScroll}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={setContainerRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayProducts.map((product) => (
          <RecentProductCard
            key={product.id}
            product={product}
            onRemove={() => removeProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Mini widget for sidebar/footer
interface RecentlyViewedMiniProps {
  maxItems?: number;
  className?: string;
}

export function RecentlyViewedMini({ maxItems = 4, className }: RecentlyViewedMiniProps) {
  const { products } = useRecentlyViewed();
  const displayProducts = products.slice(0, maxItems);

  if (displayProducts.length === 0) return null;

  return (
    <div className={cn("bg-[#1a1a1a]/50 rounded-xl p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-[#44D92C]" />
        <h4 className="font-medium text-sm">Récemment consultés</h4>
      </div>

      <div className="space-y-2">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate">{product.name}</p>
              <p className="text-xs font-bold text-[#44D92C]">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {products.length > maxItems && (
        <Link
          href="/compte/historique"
          className="block text-center text-sm text-[#44D92C] hover:underline mt-3"
        >
          Voir tout ({products.length})
        </Link>
      )}
    </div>
  );
}

export default RecentlyViewedCarousel;
