'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Star, 
  Flame,
  Zap,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { WishlistButton } from '@/components/product/WishlistButton';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types/prestashop';

interface FeaturedSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  autoPlayInterval?: number;
  showDots?: boolean;
  className?: string;
}

export function FeaturedSlider({
  products,
  title = "Produits Vedettes",
  subtitle = "Nos meilleures ventes et nouveautés",
  autoPlayInterval = 5000,
  showDots = true,
  className
}: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { addItem, isLoading } = useCart();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % products.length);
  }, [currentIndex, products.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
  }, [currentIndex, products.length, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (!isHovered && autoPlayInterval > 0) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, autoPlayInterval, nextSlide]);

  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];
  const hasDiscount = currentProduct.reduction > 0;
  const discountPercent = hasDiscount 
    ? Math.round(currentProduct.reduction_type === 'percentage' 
        ? currentProduct.reduction 
        : (currentProduct.reduction / currentProduct.price_without_reduction) * 100)
    : 0;

  return (
    <section 
      className={cn("relative overflow-hidden py-16", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#44D92C]/5 to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#44D92C]/10 rounded-full mb-4">
            <Flame className="w-5 h-5 text-[#44D92C]" />
            <span className="text-sm font-semibold text-[#44D92C]">EN VEDETTE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Main slide */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Image side */}
            <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/5">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full">
                    <Zap className="w-4 h-4" />
                    -{discountPercent}%
                  </span>
                )}
                {currentProduct.quantity <= 5 && currentProduct.quantity > 0 && (
                  <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                    Plus que {currentProduct.quantity} !
                  </span>
                )}
              </div>

              {/* Wishlist button */}
              <div className="absolute top-4 right-4 z-20">
                <WishlistButton productId={currentProduct.id} size="lg" />
              </div>

              {/* Product image */}
              <Link href={`/product/${currentProduct.link_rewrite}`} className="block h-full">
                {currentProduct.cover_image ? (
                  <Image
                    src={currentProduct.cover_image}
                    alt={currentProduct.name}
                    fill
                    className={cn(
                      "object-contain p-8 transition-all duration-700",
                      isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    )}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-32 h-32 text-gray-700" />
                  </div>
                )}
              </Link>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:bg-[#44D92C] hover:text-black hover:border-[#44D92C] transition-all opacity-0 group-hover:opacity-100 hover:opacity-100"
                aria-label="Produit précédent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:bg-[#44D92C] hover:text-black hover:border-[#44D92C] transition-all opacity-0 group-hover:opacity-100 hover:opacity-100"
                aria-label="Produit suivant"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Content side */}
            <div className={cn(
              "space-y-6 transition-all duration-500",
              isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
            )}>
              {/* Brand */}
              {currentProduct.manufacturer_name && (
                <span className="text-[#44D92C] font-semibold uppercase tracking-wider">
                  {currentProduct.manufacturer_name}
                </span>
              )}

              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                <Link 
                  href={`/product/${currentProduct.link_rewrite}`}
                  className="hover:text-[#44D92C] transition-colors"
                >
                  {currentProduct.name}
                </Link>
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-5 h-5",
                        i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                      )} 
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  (123 avis)
                </span>
              </div>

              {/* Description */}
              {currentProduct.description_short && (
                <p 
                  className="text-gray-400 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: currentProduct.description_short }}
                />
              )}

              {/* Reference */}
              {currentProduct.reference && (
                <p className="text-sm text-gray-500">
                  Réf: <span className="font-mono">{currentProduct.reference}</span>
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className={cn(
                  "text-4xl font-bold",
                  hasDiscount ? "text-[#44D92C]" : "text-white"
                )}>
                  {formatPrice(currentProduct.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(currentProduct.price_without_reduction)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                {currentProduct.quantity > 0 ? (
                  <>
                    <span className="h-3 w-3 rounded-full bg-[#44D92C] animate-pulse" />
                    <span className="text-[#44D92C] font-medium">En stock</span>
                    <span className="text-gray-500">
                      - Livraison sous 48h
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-red-400 font-medium">Rupture de stock</span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-[#44D92C] hover:bg-[#3bc425] text-black font-bold text-lg rounded-xl glow-green-hover"
                  onClick={() => addItem(currentProduct.id)}
                  disabled={isLoading || currentProduct.quantity <= 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 border-white/10 hover:bg-white/5 rounded-xl"
                  asChild
                >
                  <Link href={`/product/${currentProduct.link_rewrite}`}>
                    Voir les détails
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#44D92C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Garantie 2 ans
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#44D92C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Retour gratuit
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#44D92C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Paiement sécurisé
                </span>
              </div>
            </div>
          </div>

          {/* Dots navigation */}
          {showDots && products.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    index === currentIndex 
                      ? "w-8 h-2 bg-[#44D92C]" 
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Aller au produit ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnails */}
          {products.length > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              {products.slice(0, 6).map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                    index === currentIndex 
                      ? "border-[#44D92C] ring-2 ring-[#44D92C]/30" 
                      : "border-white/10 opacity-50 hover:opacity-100"
                  )}
                >
                  {product.cover_image ? (
                    <Image
                      src={product.cover_image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedSlider;
