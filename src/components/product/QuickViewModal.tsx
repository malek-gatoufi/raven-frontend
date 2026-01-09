'use client';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  ExternalLink,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Scale,
  Loader2,
  Star
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/prestashop';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setQuantity(1);
    }
  }, [product?.id]);

  if (!product) return null;

  const images: Array<{ id: number; url: string }> = (product.images && product.images.length > 0)
    ? product.images 
    : product.cover_image 
      ? [{ id: 0, url: product.cover_image }] 
      : [];
  
  const hasDiscount = product.on_sale && product.reduction > 0;
  const discountPercent = hasDiscount ? Math.round(product.reduction * 100) : 0;
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  async function handleAddToCart() {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await addItem(product.id, quantity);
      onClose();
    } finally {
      setIsAddingToCart(false);
    }
  }

  function prevImage() {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextImage() {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl transition-all">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid md:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative bg-[#1a1a1a] aspect-square md:aspect-auto md:h-full">
                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* Main image */}
                    <div className="relative w-full h-full min-h-[300px] md:min-h-[500px]">
                      {images.length > 0 ? (
                        <Image
                          src={images[currentImageIndex]?.url || product.cover_image || ''}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-24 h-24 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {images.slice(0, 5).map((img, idx) => (
                          <button
                            key={img.id || idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all",
                              currentImageIndex === idx 
                                ? "bg-[#44D92C] w-4" 
                                : "bg-white/40 hover:bg-white/60"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 md:p-8 flex flex-col">
                    {/* Brand */}
                    {product.manufacturer_name && (
                      <span className="text-[#44D92C] text-sm font-medium">
                        {product.manufacturer_name}
                      </span>
                    )}

                    {/* Title */}
                    <Dialog.Title className="text-xl md:text-2xl font-bold mt-1 pr-8">
                      {product.name}
                    </Dialog.Title>

                    {/* Reference */}
                    {product.reference && (
                      <p className="text-gray-500 text-sm mt-1 font-mono">
                        Réf: {product.reference}
                      </p>
                    )}

                    {/* Rating placeholder */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={cn(
                              "w-4 h-4",
                              star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">(12 avis)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-3 mt-4">
                      <span className="text-3xl font-bold text-[#44D92C]">
                        {formatPrice(product.price)}
                      </span>
                      {hasDiscount && product.price_without_reduction > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.price_without_reduction)}
                        </span>
                      )}
                    </div>

                    {/* Stock status */}
                    <div className="flex items-center gap-2 mt-4">
                      {product.quantity > 0 ? (
                        <>
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">En stock</span>
                          {product.quantity <= 5 && (
                            <span className="text-orange-400 text-sm ml-2">
                              (Plus que {product.quantity} !)
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-red-400" />
                          <span className="text-red-400 font-medium">Rupture de stock</span>
                        </>
                      )}
                    </div>

                    {/* Short description */}
                    {product.description_short && (
                      <div 
                        className="text-gray-400 text-sm mt-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: product.description_short }}
                      />
                    )}

                    {/* Quantity + Add to cart */}
                    <div className="flex items-center gap-3 mt-6">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-white/10 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3 hover:bg-white/5 transition-colors"
                          disabled={product.quantity <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                          className="p-3 hover:bg-white/5 transition-colors"
                          disabled={product.quantity <= 0}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Add to cart */}
                      <Button
                        onClick={handleAddToCart}
                        disabled={product.quantity <= 0 || isAddingToCart}
                        className="flex-1 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold h-12"
                      >
                        {isAddingToCart ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Ajouter au panier
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Secondary actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 border-white/20",
                          inWishlist && "border-red-500 bg-red-500/10"
                        )}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart className={cn("w-4 h-4 mr-2", inWishlist && "fill-red-500 text-red-500")} />
                        Favoris
                      </Button>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 border-white/20",
                          inCompare && "border-[#44D92C] bg-[#44D92C]/10"
                        )}
                        onClick={() => toggleCompare(product)}
                        disabled={!inCompare && !canAddMore}
                      >
                        <Scale className={cn("w-4 h-4 mr-2", inCompare && "text-[#44D92C]")} />
                        Comparer
                      </Button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                      <div className="flex flex-col items-center text-center gap-1">
                        <Truck className="w-5 h-5 text-[#44D92C]" />
                        <span className="text-xs text-gray-400">Livraison 24-48h</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-1">
                        <Shield className="w-5 h-5 text-[#44D92C]" />
                        <span className="text-xs text-gray-400">Paiement sécurisé</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-1">
                        <RotateCcw className="w-5 h-5 text-[#44D92C]" />
                        <span className="text-xs text-gray-400">Retour 14j</span>
                      </div>
                    </div>

                    {/* View full page link */}
                    <Link
                      href={`/product/${product.id}-${product.link_rewrite}`}
                      className="flex items-center justify-center gap-2 mt-6 text-[#44D92C] hover:underline"
                      onClick={onClose}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Voir la fiche complète
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Hook pour gérer le Quick View
import { create } from 'zustand';

interface QuickViewStore {
  product: Product | null;
  isOpen: boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useQuickView = create<QuickViewStore>((set) => ({
  product: null,
  isOpen: false,
  openQuickView: (product) => set({ product, isOpen: true }),
  closeQuickView: () => set({ isOpen: false }),
}));

// Quick View Provider component
export function QuickViewProvider() {
  const { product, isOpen, closeQuickView } = useQuickView();
  
  return (
    <QuickViewModal 
      product={product} 
      isOpen={isOpen} 
      onClose={closeQuickView} 
    />
  );
}
