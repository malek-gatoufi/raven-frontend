'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Package, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useCompare } from '@/contexts/CompareContext';
import { WishlistButton } from './WishlistButton';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/prestashop';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isLoading } = useCart();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

  const hasReduction = product.reduction > 0;
  const isOutOfStock = product.quantity <= 0;
  const inCompare = isInCompare(product.id);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product.id);
  }

  return (
    <div className={cn('group relative', className)}>
      <Link href={`/product/${product.link_rewrite}`}>
        <div className="relative overflow-hidden rounded-2xl glass hover:border-[#44D92C]/50 transition-all duration-500">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#44D92C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
            {product.cover_image ? (
              <Image
                src={product.cover_image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                <Package className="h-16 w-16 text-[#333]" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {hasReduction && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#44D92C] text-black">
                  -{product.reduction_type === 'percentage' 
                    ? `${product.reduction}%` 
                    : formatPrice(product.reduction)}
                </span>
              )}
              {product.on_sale && !hasReduction && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#44D92C] text-black">
                  PROMO
                </span>
              )}
              {isOutOfStock && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                  Rupture
                </span>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              <WishlistButton 
                productId={product.id} 
                size="md"
                className="h-10 w-10 rounded-xl"
              />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCompare(product);
                }}
                disabled={!inCompare && !canAddMore}
                className={cn(
                  "h-10 w-10 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all",
                  inCompare ? "text-[#44D92C] border-[#44D92C] bg-[#44D92C]/20" : "text-white hover:bg-[#44D92C] hover:text-black hover:border-[#44D92C]",
                  !inCompare && !canAddMore && "opacity-50 cursor-not-allowed"
                )}
                title={inCompare ? "Retirer du comparateur" : "Ajouter au comparateur"}
              >
                <Scale className="h-5 w-5" />
              </button>
            </div>

            {/* Add to cart button */}
            {!isOutOfStock && (
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <Button
                  className="w-full bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold h-12 rounded-xl glow-green-hover"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Manufacturer */}
            {product.manufacturer_name && (
              <p className="text-xs text-[#44D92C] uppercase tracking-wider font-semibold mb-2">
                {product.manufacturer_name}
              </p>
            )}

            {/* Name */}
            <h3 className="font-semibold text-white line-clamp-2 group-hover:text-[#44D92C] transition-colors leading-tight">
              {product.name}
            </h3>

            {/* Reference */}
            {product.reference && (
              <p className="text-xs text-[#666] mt-2">
                Réf: {product.reference}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mt-3">
              <span className={cn(
                'font-bold text-xl',
                hasReduction ? 'text-[#44D92C]' : 'text-white'
              )}>
                {formatPrice(product.price)}
              </span>
              {hasReduction && (
                <span className="text-sm text-[#666] line-through">
                  {formatPrice(product.price_without_reduction)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="mt-3 flex items-center gap-2">
              {isOutOfStock ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs text-red-400">Rupture de stock</span>
                </>
              ) : product.quantity <= 5 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-amber-400">
                    Plus que {product.quantity} en stock
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#44D92C]" />
                  <span className="text-xs text-[#44D92C]">En stock</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
