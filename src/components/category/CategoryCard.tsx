'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/prestashop';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.link_rewrite}`}>
      <Card className={cn(
        'group overflow-hidden transition-shadow hover:shadow-lg',
        className
      )}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
              <span className="text-5xl">📁</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Content */}
          <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg group-hover:underline">
              {category.name}
            </h3>
            {category.nb_products !== undefined && category.nb_products > 0 && (
              <p className="text-sm text-white/80">
                {category.nb_products} produit{category.nb_products > 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
