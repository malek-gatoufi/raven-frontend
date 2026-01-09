'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://ravenindustries.fr${item.href}` : undefined,
    })),
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav 
        aria-label="Fil d'Ariane"
        className={cn(
          "flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide py-2",
          className
        )}
      >
        {/* Home link */}
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors shrink-0"
          aria-label="Accueil"
        >
          <Home className="w-4 h-4" />
          <span className="sr-only">Accueil</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
              
              {isLast || !item.href ? (
                <span 
                  className={cn(
                    "font-medium truncate max-w-[200px]",
                    isLast ? "text-[#44D92C]" : "text-gray-400"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}

// Breadcrumb avec style card
export function BreadcrumbCard({ items, className }: BreadcrumbProps) {
  return (
    <div className={cn(
      "px-4 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm",
      className
    )}>
      <Breadcrumb items={items} />
    </div>
  );
}

// Breadcrumb avec contexte catégorie
interface CategoryBreadcrumbProps {
  category: {
    id: number;
    name: string;
    id_parent: number;
  };
  parents?: Array<{
    id: number;
    name: string;
    link_rewrite: string;
  }>;
  className?: string;
}

export function CategoryBreadcrumb({ category, parents = [], className }: CategoryBreadcrumbProps) {
  const items: BreadcrumbItem[] = parents.map(parent => ({
    label: parent.name,
    href: `/categorie/${parent.id}-${parent.link_rewrite}`,
  }));

  items.push({ label: category.name });

  return <Breadcrumb items={items} className={className} />;
}

// Breadcrumb produit
interface ProductBreadcrumbProps {
  product: {
    name: string;
    id_category_default: number;
  };
  categoryPath?: Array<{
    id: number;
    name: string;
    link_rewrite: string;
  }>;
  className?: string;
}

export function ProductBreadcrumb({ product, categoryPath = [], className }: ProductBreadcrumbProps) {
  const items: BreadcrumbItem[] = categoryPath.map(cat => ({
    label: cat.name,
    href: `/categorie/${cat.id}-${cat.link_rewrite}`,
  }));

  items.push({ label: product.name });

  return <Breadcrumb items={items} className={className} />;
}

export default Breadcrumb;
