'use client';

import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/prestashop';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({ 
  products, 
  loading = false, 
  columns = 4,
  className 
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={cn('grid gap-6', gridCols[columns], className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#44D92C]/10 flex items-center justify-center mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
        <p className="text-[#999] max-w-md">
          Essayez de modifier vos critères de recherche ou explorez nos autres catégories
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl glass overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#1a1a1a]" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/4 bg-[#44D92C]/20 rounded" />
        <div className="h-5 w-full bg-white/10 rounded" />
        <div className="h-5 w-3/4 bg-white/10 rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-[#44D92C]/20 rounded" />
          <div className="h-6 w-16 bg-white/5 rounded" />
        </div>
        <div className="h-3 w-1/3 bg-white/5 rounded" />
      </div>
    </div>
  );
}
