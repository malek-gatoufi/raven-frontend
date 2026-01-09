'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Check, Minus, Plus, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface StickyProduct {
  id: number;
  name: string;
  price: number;
  price_without_reduction?: number;
  quantity: number;
  reference?: string;
  cover?: {
    medium?: string;
  };
}

interface StickyAddToCartProps {
  product: StickyProduct;
  selectedVariant?: {
    id_product_attribute?: number;
    reference?: string;
    price?: number;
    quantity?: number;
  };
  className?: string;
}

export function StickyAddToCart({ product, selectedVariant, className }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when original add to cart is not visible
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px',
      }
    );

    // Observer l'élément "add-to-cart-zone" sur la page
    const addToCartZone = document.getElementById('add-to-cart-zone');
    if (addToCartZone) {
      observer.observe(addToCartZone);
    }

    return () => observer.disconnect();
  }, []);

  const currentPrice = selectedVariant?.price ?? product.price;
  const originalPrice = product.price_without_reduction;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const inStock = (selectedVariant?.quantity ?? product.quantity) > 0;
  const isWished = isInWishlist(product.id);

  async function handleAddToCart() {
    if (!inStock) return;
    
    setIsAdding(true);
    try {
      await addItem(product.id, quantity, selectedVariant?.id_product_attribute);
      openCart();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}
    >
      {/* Glass background */}
      <div className="bg-[#1a1a1a]/95 backdrop-blur-lg border-t border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Product thumbnail */}
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden relative">
                <Image
                  src={product.cover?.medium || '/placeholder.webp'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="max-w-[200px]">
                <p className="font-medium text-sm truncate">{product.name}</p>
                {selectedVariant?.reference && (
                  <p className="text-xs text-gray-400">Réf: {selectedVariant.reference}</p>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#44D92C]">
                  {currentPrice.toFixed(2)} €
                </span>
                {hasDiscount && originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>
              {!inStock && (
                <span className="text-xs text-red-500">Rupture de stock</span>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Quantity selector */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg border border-white/10">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-white/10 rounded-l-lg transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-white/10 rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                isWished
                  ? "bg-red-500/10 border-red-500/50 text-red-500"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
              )}
              aria-label={isWished ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={cn("w-5 h-5", isWished && "fill-current")} />
            </button>

            {/* Add to cart button */}
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || isAdding}
              className={cn(
                "font-bold px-6 transition-all",
                showSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-[#44D92C] hover:bg-[#3bc425]",
                "text-black"
              )}
            >
              {showSuccess ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Ajouté !
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Ajouter au panier</span>
                  <span className="sm:hidden">Ajouter</span>
                </>
              )}
            </Button>

            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Retour en haut"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to mark the add-to-cart zone (put this around your main add to cart)
export function AddToCartZone({ children }: { children: React.ReactNode }) {
  return (
    <div id="add-to-cart-zone">
      {children}
    </div>
  );
}

export default StickyAddToCart;
