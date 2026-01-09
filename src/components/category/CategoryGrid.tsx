'use client';

import { CategoryCard } from './CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category } from '@/types/prestashop';
import { cn } from '@/lib/utils';

interface CategoryGridProps {
  categories: Category[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CategoryGrid({ 
  categories, 
  loading = false, 
  columns = 3,
  className 
}: CategoryGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={cn('grid gap-6', gridCols[columns], className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-6xl mb-4">📂</span>
        <h3 className="text-lg font-medium mb-2">Aucune catégorie trouvée</h3>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
    </div>
  );
}
