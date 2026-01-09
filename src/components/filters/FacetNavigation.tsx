'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronRight, 
  X, 
  SlidersHorizontal,
  Check,
  Package,
  Tag,
  Layers,
  DollarSign,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/prestashop';

interface FacetFilter {
  id: string;
  name: string;
  type: 'checkbox' | 'range' | 'category';
  values?: Array<{
    id: string | number;
    name: string;
    count?: number;
    selected?: boolean;
  }>;
  min?: number;
  max?: number;
  currentMin?: number;
  currentMax?: number;
}

interface FacetNavigationProps {
  categories?: Category[];
  currentCategory?: Category;
  manufacturers?: Array<{ id: number; name: string; count?: number }>;
  priceRange?: { min: number; max: number };
  features?: Array<{
    id: number;
    name: string;
    values: Array<{ id: number; name: string; count?: number }>;
  }>;
  totalProducts?: number;
  className?: string;
}

export function FacetNavigation({
  categories = [],
  currentCategory,
  manufacturers = [],
  priceRange = { min: 0, max: 1000 },
  features = [],
  totalProducts = 0,
  className
}: FacetNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    manufacturers: false,
    stock: true,
  });

  // Get current filter values from URL
  const currentFilters = {
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    manufacturer: searchParams.getAll('manufacturer'),
    in_stock: searchParams.get('in_stock') === 'true',
    on_sale: searchParams.get('on_sale') === 'true',
    features: searchParams.getAll('feature'),
  };

  const [priceValues, setPriceValues] = useState([
    currentFilters.min_price ? Number(currentFilters.min_price) : priceRange.min,
    currentFilters.max_price ? Number(currentFilters.max_price) : priceRange.max,
  ]);

  // Update URL with new filters
  const updateFilters = useCallback((key: string, value: string | string[] | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page when filters change
    params.delete('page');
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach(v => params.append(key, v));
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
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Check if any filters are active
  const hasActiveFilters = 
    currentFilters.min_price || 
    currentFilters.max_price || 
    currentFilters.manufacturer.length > 0 || 
    currentFilters.in_stock || 
    currentFilters.on_sale ||
    currentFilters.features.length > 0;

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
      
      return (
        <div key={cat.id} className={cn("relative", level > 0 && "ml-4")}>
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
              {cat.name}
            </span>
            {cat.nb_products && (
              <span className="text-xs text-gray-500">({cat.nb_products})</span>
            )}
          </Link>
          
          {hasChildren && (isActive || level === 0) && (
            <div className="mt-1">
              {renderCategoryTree(cat.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const FilterContent = () => (
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
            className="text-xs text-gray-400 hover:text-red-400"
          >
            <X className="w-3 h-3 mr-1" />
            Tout effacer
          </Button>
        )}
      </div>

      {/* Results count */}
      {totalProducts > 0 && (
        <p className="text-sm text-gray-500">
          {totalProducts} produit{totalProducts > 1 ? 's' : ''} trouvé{totalProducts > 1 ? 's' : ''}
        </p>
      )}

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
            <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
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
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={priceValues[0]}
                  onChange={(e) => setPriceValues([Number(e.target.value), priceValues[1]])}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#44D92C] outline-none"
                  min={priceRange.min}
                  max={priceValues[1]}
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  value={priceValues[1]}
                  onChange={(e) => setPriceValues([priceValues[0], Number(e.target.value)])}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#44D92C] outline-none"
                  min={priceValues[0]}
                  max={priceRange.max}
                />
              </div>
              <span className="text-gray-500 text-sm">€</span>
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

      {/* Manufacturers */}
      {manufacturers.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => toggleSection('manufacturers')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="flex items-center gap-2 font-medium">
              <Tag className="w-4 h-4 text-[#44D92C]" />
              Marques
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-500 transition-transform",
              expandedSections.manufacturers && "rotate-180"
            )} />
          </button>
          
          {expandedSections.manufacturers && (
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {manufacturers.map(m => {
                const isSelected = currentFilters.manufacturer.includes(String(m.id));
                return (
                  <label 
                    key={m.id} 
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...currentFilters.manufacturer, String(m.id)]
                          : currentFilters.manufacturer.filter(id => id !== String(m.id));
                        updateFilters('manufacturer', newValue);
                      }}
                      className="border-white/20 data-[state=checked]:bg-[#44D92C] data-[state=checked]:border-[#44D92C]"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                      {m.name}
                    </span>
                    {m.count !== undefined && (
                      <span className="text-xs text-gray-500">({m.count})</span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Features */}
      {features.map(feature => (
        <div key={feature.id} className="border-t border-white/10 pt-4">
          <button
            onClick={() => toggleSection(`feature_${feature.id}`)}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="flex items-center gap-2 font-medium">
              <Filter className="w-4 h-4 text-[#44D92C]" />
              {feature.name}
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-500 transition-transform",
              expandedSections[`feature_${feature.id}`] && "rotate-180"
            )} />
          </button>
          
          {expandedSections[`feature_${feature.id}`] && (
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {feature.values.map(v => {
                const featureKey = `${feature.id}_${v.id}`;
                const isSelected = currentFilters.features.includes(featureKey);
                return (
                  <label 
                    key={v.id} 
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...currentFilters.features, featureKey]
                          : currentFilters.features.filter(f => f !== featureKey);
                        updateFilters('feature', newValue);
                      }}
                      className="border-white/20 data-[state=checked]:bg-[#44D92C] data-[state=checked]:border-[#44D92C]"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                      {v.name}
                    </span>
                    {v.count !== undefined && (
                      <span className="text-xs text-gray-500">({v.count})</span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setMobileOpen(true)}
          variant="outline"
          className="w-full border-white/10 hover:border-[#44D92C]"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtres
          {hasActiveFilters && (
            <span className="ml-2 w-5 h-5 rounded-full bg-[#44D92C] text-black text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filtres</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:block w-64 flex-shrink-0",
        className
      )}>
        <div className="sticky top-24 bg-[#1a1a1a]/50 rounded-2xl border border-white/10 p-5">
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
