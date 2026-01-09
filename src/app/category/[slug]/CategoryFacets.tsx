'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronRight, 
  X, 
  SlidersHorizontal,
  Package,
  Tag,
  Layers,
  DollarSign,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/prestashop';

interface CategoryFacetsProps {
  categories: Category[];
  currentCategory?: Category;
  priceRange?: { min: number; max: number };
  totalProducts?: number;
}

function FacetContent({ 
  categories, 
  currentCategory, 
  priceRange = { min: 0, max: 1000 },
  totalProducts = 0 
}: CategoryFacetsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    stock: true,
  });

  // Get current filter values from URL
  const currentFilters = {
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    in_stock: searchParams.get('in_stock') === 'true',
    on_sale: searchParams.get('on_sale') === 'true',
  };

  const [priceValues, setPriceValues] = useState([
    currentFilters.min_price ? Number(currentFilters.min_price) : priceRange.min,
    currentFilters.max_price ? Number(currentFilters.max_price) : priceRange.max,
  ]);

  // Update URL with new filters
  const updateFilters = useCallback((key: string, value: string | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    
    if (value === null || value === '') {
      params.delete(key);
    } else if (typeof value === 'boolean') {
      if (value) {
        params.set(key, 'true');
      } else {
        params.delete(key);
      }
    } else {
      params.set(key, value);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Check if any filters are active
  const hasActiveFilters = 
    currentFilters.min_price || 
    currentFilters.max_price || 
    currentFilters.in_stock || 
    currentFilters.on_sale;

  // Apply price filter
  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    
    if (priceValues[0] > priceRange.min) {
      params.set('min_price', String(priceValues[0]));
    } else {
      params.delete('min_price');
    }
    
    if (priceValues[1] < priceRange.max) {
      params.set('max_price', String(priceValues[1]));
    } else {
      params.delete('max_price');
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Render category tree recursively
  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map(cat => {
      const isActive = currentCategory?.id === cat.id;
      const hasChildren = cat.children && cat.children.length > 0;
      const isParentOfCurrent = currentCategory && cat.children?.some(
        c => c.id === currentCategory.id || c.children?.some(cc => cc.id === currentCategory.id)
      );
      
      return (
        <div key={cat.id} className={cn("relative", level > 0 && "ml-3")}>
          <Link
            href={`/category/${cat.id}-${cat.link_rewrite}`}
            className={cn(
              "flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-all",
              isActive 
                ? "bg-[#44D92C]/20 text-[#44D92C] font-medium" 
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className="flex items-center gap-2">
              {level > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
              <span className="truncate">{cat.name}</span>
            </span>
            {cat.nb_products !== undefined && (
              <span className="text-xs text-gray-500 ml-2">({cat.nb_products})</span>
            )}
          </Link>
          
          {hasChildren && (isActive || isParentOfCurrent || level === 0) && (
            <div className="mt-1">
              {renderCategoryTree(cat.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#44D92C]" />
          <h3 className="font-semibold text-lg">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-gray-400 hover:text-red-400 h-auto p-1"
          >
            <X className="w-3 h-3 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="flex items-center gap-2 font-medium">
              <Layers className="w-4 h-4 text-[#44D92C]" />
              Catégories
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-500 transition-transform",
              expandedSections.categories && "rotate-180"
            )} />
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin pr-1">
              {renderCategoryTree(categories)}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      <div className="border-t border-white/10 pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="flex items-center gap-2 font-medium">
            <DollarSign className="w-4 h-4 text-[#44D92C]" />
            Prix
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 text-gray-500 transition-transform",
            expandedSections.price && "rotate-180"
          )} />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-4 px-1">
            <Slider
              value={priceValues}
              onValueChange={setPriceValues}
              min={priceRange.min}
              max={priceRange.max}
              step={1}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceValues[0]}
                onChange={(e) => setPriceValues([Number(e.target.value), priceValues[1]])}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm focus:border-[#44D92C] outline-none w-20"
                min={priceRange.min}
                max={priceValues[1]}
              />
              <span className="text-gray-500 text-sm">-</span>
              <input
                type="number"
                value={priceValues[1]}
                onChange={(e) => setPriceValues([priceValues[0], Number(e.target.value)])}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm focus:border-[#44D92C] outline-none w-20"
                min={priceValues[0]}
                max={priceRange.max}
              />
              <span className="text-gray-500 text-xs">€</span>
            </div>
            <Button
              onClick={applyPriceFilter}
              size="sm"
              className="w-full bg-[#44D92C]/20 hover:bg-[#44D92C]/30 text-[#44D92C] border border-[#44D92C]/30"
            >
              Appliquer
            </Button>
          </div>
        )}
      </div>

      {/* Stock & Sale filters */}
      <div className="border-t border-white/10 pt-4">
        <button
          onClick={() => toggleSection('stock')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="flex items-center gap-2 font-medium">
            <Package className="w-4 h-4 text-[#44D92C]" />
            Disponibilité
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 text-gray-500 transition-transform",
            expandedSections.stock && "rotate-180"
          )} />
        </button>
        
        {expandedSections.stock && (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={currentFilters.in_stock}
                onCheckedChange={(checked) => updateFilters('in_stock', !!checked)}
                className="border-white/20 data-[state=checked]:bg-[#44D92C] data-[state=checked]:border-[#44D92C]"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                En stock uniquement
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={currentFilters.on_sale}
                onCheckedChange={(checked) => updateFilters('on_sale', !!checked)}
                className="border-white/20 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                En promotion
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-[#44D92C]" />
    </div>
  );
}

export function CategoryFacets(props: CategoryFacetsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4 w-full">
        <Button
          onClick={() => setMobileOpen(true)}
          variant="outline"
          className="w-full border-white/10 hover:border-[#44D92C]"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtrer les produits
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-xs bg-[#0a0a0a] border-r border-white/10 overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-4 flex items-center justify-between z-10">
              <h3 className="font-semibold text-lg">Filtres</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <Suspense fallback={<LoadingFallback />}>
                <FacetContent {...props} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-[#1a1a1a]/50 rounded-2xl border border-white/10 p-5">
          <Suspense fallback={<LoadingFallback />}>
            <FacetContent {...props} />
          </Suspense>
        </div>
      </aside>
    </>
  );
}
