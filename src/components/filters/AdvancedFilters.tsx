'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Check,
  RotateCcw,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/prestashop';

const API_BASE = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

interface FilterState {
  categories: number[];
  brands: number[];
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  onSale: boolean;
  rating: number | null;
  sort: string;
}

interface Brand {
  id: number;
  name: string;
  count?: number;
}

interface AdvancedFiltersProps {
  categories?: Category[];
  brands?: Brand[];
  currentFilters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalProducts?: number;
  className?: string;
}

export function AdvancedFilters({
  categories = [],
  brands = [],
  currentFilters,
  onFiltersChange,
  totalProducts = 0,
  className
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    availability: true,
    rating: false,
  });

  const [localPriceMin, setLocalPriceMin] = useState(currentFilters.minPrice?.toString() || '');
  const [localPriceMax, setLocalPriceMax] = useState(currentFilters.maxPrice?.toString() || '');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...currentFilters, [key]: value });
  };

  const toggleCategory = (categoryId: number) => {
    const newCategories = currentFilters.categories.includes(categoryId)
      ? currentFilters.categories.filter(id => id !== categoryId)
      : [...currentFilters.categories, categoryId];
    updateFilter('categories', newCategories);
  };

  const toggleBrand = (brandId: number) => {
    const newBrands = currentFilters.brands.includes(brandId)
      ? currentFilters.brands.filter(id => id !== brandId)
      : [...currentFilters.brands, brandId];
    updateFilter('brands', newBrands);
  };

  const applyPriceFilter = () => {
    onFiltersChange({
      ...currentFilters,
      minPrice: localPriceMin ? parseFloat(localPriceMin) : null,
      maxPrice: localPriceMax ? parseFloat(localPriceMax) : null,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      minPrice: null,
      maxPrice: null,
      inStock: false,
      onSale: false,
      rating: null,
      sort: 'relevance',
    });
    setLocalPriceMin('');
    setLocalPriceMax('');
  };

  const activeFiltersCount = 
    currentFilters.categories.length + 
    currentFilters.brands.length + 
    (currentFilters.minPrice ? 1 : 0) + 
    (currentFilters.maxPrice ? 1 : 0) + 
    (currentFilters.inStock ? 1 : 0) + 
    (currentFilters.onSale ? 1 : 0) +
    (currentFilters.rating ? 1 : 0);

  return (
    <div className={cn("bg-[#1a1a1a]/50 rounded-2xl border border-white/5 overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#44D92C]" />
            <h3 className="font-semibold">Filtres</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-[#44D92C] text-black text-xs font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#44D92C] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          )}
        </div>
        {totalProducts > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {totalProducts} produit{totalProducts > 1 ? 's' : ''} trouvé{totalProducts > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection
          title="Catégories"
          expanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  currentFilters.categories.includes(category.id)
                    ? "bg-[#44D92C] border-[#44D92C]"
                    : "border-gray-600"
                )}>
                  {currentFilters.categories.includes(category.id) && (
                    <Check className="w-3 h-3 text-black" />
                  )}
                </div>
                <span className="flex-1 text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection
          title="Marques"
          expanded={expandedSections.brands}
          onToggle={() => toggleSection('brands')}
        >
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  currentFilters.brands.includes(brand.id)
                    ? "bg-[#44D92C] border-[#44D92C]"
                    : "border-gray-600"
                )}>
                  {currentFilters.brands.includes(brand.id) && (
                    <Check className="w-3 h-3 text-black" />
                  )}
                </div>
                <span className="flex-1 text-sm">{brand.name}</span>
                {brand.count !== undefined && (
                  <span className="text-xs text-gray-500">({brand.count})</span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price */}
      <FilterSection
        title="Prix"
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (€)</label>
              <Input
                type="number"
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(e.target.value)}
                placeholder="0"
                className="h-9 bg-white/5 border-white/10"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (€)</label>
              <Input
                type="number"
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(e.target.value)}
                placeholder="∞"
                className="h-9 bg-white/5 border-white/10"
              />
            </div>
          </div>
          <Button
            size="sm"
            onClick={applyPriceFilter}
            className="w-full bg-white/10 hover:bg-white/20 text-white"
          >
            Appliquer
          </Button>
          
          {/* Quick price filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: '< 50€', min: null, max: 50 },
              { label: '50-100€', min: 50, max: 100 },
              { label: '100-200€', min: 100, max: 200 },
              { label: '> 200€', min: 200, max: null },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  setLocalPriceMin(range.min?.toString() || '');
                  setLocalPriceMax(range.max?.toString() || '');
                  onFiltersChange({
                    ...currentFilters,
                    minPrice: range.min,
                    maxPrice: range.max,
                  });
                }}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border transition-colors",
                  currentFilters.minPrice === range.min && currentFilters.maxPrice === range.max
                    ? "bg-[#44D92C] text-black border-[#44D92C]"
                    : "border-white/10 hover:border-[#44D92C]/50"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection
        title="Disponibilité"
        expanded={expandedSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              currentFilters.inStock
                ? "bg-[#44D92C] border-[#44D92C]"
                : "border-gray-600"
            )}>
              {currentFilters.inStock && <Check className="w-3 h-3 text-black" />}
            </div>
            <span className="text-sm">En stock uniquement</span>
          </label>
          
          <label 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
            onClick={() => updateFilter('inStock', !currentFilters.inStock)}
          >
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              currentFilters.onSale
                ? "bg-[#44D92C] border-[#44D92C]"
                : "border-gray-600"
            )}>
              {currentFilters.onSale && <Check className="w-3 h-3 text-black" />}
            </div>
            <span className="text-sm">En promotion</span>
          </label>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection
        title="Note minimum"
        expanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-1">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilter('rating', currentFilters.rating === rating ? null : rating)}
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg transition-colors",
                currentFilters.rating === rating
                  ? "bg-[#44D92C]/10 border border-[#44D92C]/30"
                  : "hover:bg-white/5"
              )}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">et plus</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Mobile filter drawer
interface MobileFiltersDrawerProps extends AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFiltersDrawer({
  isOpen,
  onClose,
  ...filterProps
}: MobileFiltersDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-[#0a0a0a] z-50 overflow-y-auto animate-in slide-in-from-left duration-300">
        <div className="sticky top-0 flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/10">
          <h2 className="text-lg font-bold">Filtres</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <AdvancedFilters {...filterProps} className="border-0 rounded-none" />
        
        <div className="sticky bottom-0 p-4 bg-[#0a0a0a] border-t border-white/10">
          <Button
            onClick={onClose}
            className="w-full bg-[#44D92C] hover:bg-[#3bc425] text-black font-bold"
          >
            Voir les résultats ({filterProps.totalProducts})
          </Button>
        </div>
      </div>
    </>
  );
}

// Sort dropdown
interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'name_asc', label: 'Nom A-Z' },
  { value: 'name_desc', label: 'Nom Z-A' },
  { value: 'newest', label: 'Plus récents' },
  { value: 'best_sellers', label: 'Meilleures ventes' },
];

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentOption = sortOptions.find(o => o.value === value) || sortOptions[0];

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
      >
        <span className="text-sm">Trier: {currentOption.label}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                  option.value === value
                    ? "bg-[#44D92C]/10 text-[#44D92C]"
                    : "hover:bg-white/5"
                )}
              >
                {option.label}
                {option.value === value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdvancedFilters;
