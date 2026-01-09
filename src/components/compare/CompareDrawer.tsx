'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCompare, MAX_COMPARE_ITEMS } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { 
  X, 
  ArrowRight, 
  Trash2, 
  ShoppingCart, 
  Package,
  Scale,
  Check,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/prestashop';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

// Attributs à comparer
const compareAttributes = [
  { key: 'price', label: 'Prix', format: (v: number) => formatPrice(v) },
  { key: 'reference', label: 'Référence', format: (v: string) => v || '-' },
  { key: 'manufacturer', label: 'Marque', format: (v: string) => v || '-' },
  { key: 'quantity', label: 'Stock', format: (v: number) => v > 0 ? `${v} en stock` : 'Rupture' },
  { key: 'weight', label: 'Poids', format: (v: number) => v ? `${v} kg` : '-' },
  { key: 'condition', label: 'État', format: (v: string) => v === 'new' ? 'Neuf' : v === 'used' ? 'Occasion' : v || '-' },
];

export function CompareDrawer() {
  const { items, isOpen, closeCompare, removeFromCompare, clearCompare, count } = useCompare();
  const { addItem } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeCompare}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        'fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out',
        isOpen ? 'translate-y-0' : 'translate-y-full'
      )}>
        <div className="bg-[#0a0a0a] border-t border-white/10 max-h-[80vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-[#44D92C]" />
              <h2 className="text-lg font-semibold">
                Comparateur ({count}/{MAX_COMPARE_ITEMS})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompare}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Tout effacer
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCompare}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {count === 0 ? (
            <div className="p-8 text-center">
              <Scale className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Ajoutez des produits pour les comparer
              </p>
              <Button onClick={closeCompare} variant="outline">
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                {/* Products header */}
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left text-sm text-gray-400 w-40">Produit</th>
                    {items.map((product) => (
                      <th key={product.id} className="p-4 text-center min-w-[200px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                            <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden bg-white/5 mb-2">
                              {product.cover_image ? (
                                <Image
                                  src={product.cover_image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium line-clamp-2 hover:text-[#44D92C]">
                              {product.name}
                            </p>
                          </Link>
                        </div>
                      </th>
                    ))}
                    {/* Empty slots */}
                    {Array.from({ length: MAX_COMPARE_ITEMS - count }).map((_, i) => (
                      <th key={`empty-${i}`} className="p-4 text-center min-w-[200px]">
                        <div className="w-24 h-24 mx-auto rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center mb-2">
                          <span className="text-gray-600 text-2xl">+</span>
                        </div>
                        <p className="text-sm text-gray-500">Ajouter un produit</p>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Comparison rows */}
                <tbody>
                  {compareAttributes.map((attr) => (
                    <tr key={attr.key} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-sm font-medium text-gray-400">
                        {attr.label}
                      </td>
                      {items.map((product) => {
                        const value = (product as unknown as Record<string, unknown>)[attr.key];
                        const formattedValue = attr.format(value as never);
                        
                        // Highlight best price
                        const isBestPrice = attr.key === 'price' && 
                          product.price === Math.min(...items.map(p => p.price));
                        
                        return (
                          <td 
                            key={product.id} 
                            className={cn(
                              "p-4 text-center",
                              isBestPrice && "text-[#44D92C] font-semibold"
                            )}
                          >
                            {formattedValue}
                            {isBestPrice && items.length > 1 && (
                              <span className="block text-xs text-[#44D92C]">Meilleur prix</span>
                            )}
                          </td>
                        );
                      })}
                      {Array.from({ length: MAX_COMPARE_ITEMS - count }).map((_, i) => (
                        <td key={`empty-${i}`} className="p-4 text-center text-gray-600">
                          <Minus className="w-4 h-4 mx-auto" />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Add to cart row */}
                  <tr className="border-t border-white/10">
                    <td className="p-4"></td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <Button
                          onClick={() => addItem(product.id)}
                          disabled={product.quantity <= 0}
                          className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </td>
                    ))}
                    {Array.from({ length: MAX_COMPARE_ITEMS - count }).map((_, i) => (
                      <td key={`empty-${i}`} className="p-4"></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Floating compare button
export function CompareFloatingButton() {
  const { count, openCompare } = useCompare();

  if (count === 0) return null;

  return (
    <button
      onClick={openCompare}
      className={cn(
        "fixed bottom-6 right-6 z-30 flex items-center gap-2",
        "px-4 py-3 rounded-full shadow-lg",
        "bg-[#44D92C] text-black font-semibold",
        "hover:bg-[#3bc425] transition-all",
        "animate-bounce-slow"
      )}
    >
      <Scale className="w-5 h-5" />
      Comparer ({count})
    </button>
  );
}

// Button to add/remove from compare
interface CompareButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

export function CompareButton({ product, className, size = 'md', variant = 'icon' }: CompareButtonProps) {
  const { isInCompare, toggleCompare, canAddMore } = useCompare();
  const inCompare = isInCompare(product.id);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        onClick={() => toggleCompare(product)}
        disabled={!inCompare && !canAddMore}
        className={cn(
          'border-white/20 hover:border-[#44D92C] transition-all',
          inCompare && 'border-[#44D92C] bg-[#44D92C]/10',
          className
        )}
      >
        <Scale className={cn(iconSizes[size], inCompare && 'text-[#44D92C]')} />
        <span className="ml-2">
          {inCompare ? 'Dans le comparateur' : 'Comparer'}
        </span>
      </Button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(product);
      }}
      disabled={!inCompare && !canAddMore}
      className={cn(
        'flex items-center justify-center rounded-xl transition-all duration-200',
        'bg-black/60 backdrop-blur-sm',
        'border border-white/10 hover:border-[#44D92C]',
        sizeClasses[size],
        inCompare && 'border-[#44D92C] bg-[#44D92C]/20',
        !inCompare && !canAddMore && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={inCompare ? 'Retirer du comparateur' : canAddMore ? 'Ajouter au comparateur' : 'Comparateur plein'}
    >
      <Scale className={cn(
        iconSizes[size],
        inCompare ? 'text-[#44D92C]' : 'text-white/70 hover:text-white'
      )} />
    </button>
  );
}
