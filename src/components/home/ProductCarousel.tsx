'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types/prestashop';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  autoScroll?: boolean;
  scrollInterval?: number;
  className?: string;
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  viewAllLink,
  autoScroll = false,
  scrollInterval = 3000,
  className
}: ProductCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addItem } = useCart();

  const updateScrollButtons = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();

    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [updateScrollButtons, products]);

  // Auto scroll
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, scrollInterval]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 320;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className={cn("py-12", className)}>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-gray-400 mt-2">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="text-[#44D92C] hover:underline font-medium hidden md:block"
            >
              Voir tout →
            </Link>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <CarouselCard key={product.id} product={product} onAddToCart={addItem} />
        ))}
      </div>

      {/* Mobile view all */}
      {viewAllLink && (
        <div className="text-center mt-6 md:hidden">
          <Link 
            href={viewAllLink}
            className="text-[#44D92C] hover:underline font-medium"
          >
            Voir tous les produits →
          </Link>
        </div>
      )}
    </section>
  );
}

interface CarouselCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

function CarouselCard({ product, onAddToCart }: CarouselCardProps) {
  const hasDiscount = product.reduction > 0;
  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="flex-shrink-0 w-[280px] group">
      <Link href={`/product/${product.link_rewrite}`}>
        <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a]/50 border border-white/5 hover:border-[#44D92C]/30 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[#111]">
            {product.cover_image ? (
              <Image
                src={product.cover_image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-700" />
              </div>
            )}

            {/* Badge */}
            {hasDiscount && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                -{product.reduction_type === 'percentage' 
                  ? `${product.reduction}%` 
                  : formatPrice(product.reduction)}
              </span>
            )}

            {/* Quick add button */}
            {!isOutOfStock && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product.id);
                }}
                className="absolute bottom-3 right-3 p-3 bg-[#44D92C] text-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {product.manufacturer_name && (
              <p className="text-xs text-[#44D92C] uppercase tracking-wider mb-1">
                {product.manufacturer_name}
              </p>
            )}
            <h3 className="font-medium text-sm line-clamp-2 min-h-[40px] group-hover:text-[#44D92C] transition-colors">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={cn(
                "font-bold text-lg",
                hasDiscount ? "text-[#44D92C]" : "text-white"
              )}>
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price_without_reduction)}
                </span>
              )}
            </div>
            
            {/* Stock */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                isOutOfStock ? "bg-red-500" : "bg-[#44D92C]"
              )} />
              <span className={cn(
                "text-xs",
                isOutOfStock ? "text-red-400" : "text-gray-400"
              )}>
                {isOutOfStock ? "Rupture" : "En stock"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCarousel;
