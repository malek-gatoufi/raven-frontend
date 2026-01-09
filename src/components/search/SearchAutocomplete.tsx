'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Package, Loader2, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/prestashop';

const API_BASE = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

interface SearchResult {
  products: Product[];
  total: number;
}

// Recherches populaires (à dynamiser plus tard)
const popularSearches = [
  'plaquettes de frein',
  'filtre à huile',
  'chaîne',
  'pneu',
  'batterie',
];

// Hook pour debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

export function SearchAutocomplete({ 
  className, 
  placeholder = "Rechercher une pièce, une référence...",
  onClose,
  autoFocus = false 
}: SearchAutocompleteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      } catch {}
    }
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function performSearch(searchQuery: string) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=search&q=${encodeURIComponent(searchQuery)}&limit=6`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function saveRecentSearch(searchQuery: string) {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  }

  function handleProductClick(product: Product) {
    saveRecentSearch(query.trim() || product.name);
    setIsOpen(false);
    onClose?.();
    router.push(`/product/${product.id}-${product.link_rewrite}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleProductClick(results[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  const showDropdown = isOpen && (query.length >= 2 || recentSearches.length > 0);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full h-12 pl-4 pr-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-[#666] focus:border-[#44D92C] focus:ring-[#44D92C]/20 transition-all"
          />
          <Button 
            type="submit"
            size="icon" 
            className="absolute right-1 top-1 h-10 w-10 bg-[#44D92C] hover:bg-[#3bc425] text-black rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Results */}
          {results.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
                Produits ({results.length})
              </p>
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    selectedIndex === index 
                      ? "bg-[#44D92C]/10 border border-[#44D92C]/30" 
                      : "hover:bg-white/5"
                  )}
                >
                  {/* Image */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    {product.cover_image ? (
                      <Image
                        src={product.cover_image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {product.reference && (
                        <span className="font-mono">{product.reference}</span>
                      )}
                      {product.manufacturer_name && (
                        <>
                          <span>•</span>
                          <span>{product.manufacturer_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#44D92C]">{formatPrice(product.price)}</p>
                    {product.quantity > 0 ? (
                      <p className="text-xs text-green-500">En stock</p>
                    ) : (
                      <p className="text-xs text-red-500">Rupture</p>
                    )}
                  </div>
                </button>
              ))}
              
              {/* View all results */}
              <button
                onClick={handleSubmit as any}
                className="w-full flex items-center justify-center gap-2 p-3 text-[#44D92C] hover:bg-[#44D92C]/10 rounded-lg transition-colors"
              >
                Voir tous les résultats
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-400">Aucun résultat pour "{query}"</p>
              <p className="text-sm text-gray-500 mt-1">
                Essayez avec d'autres mots-clés
              </p>
            </div>
          )}

          {/* Recent & Popular searches */}
          {query.length < 2 && (
            <div className="p-4 space-y-4">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <p className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3" />
                    Recherches récentes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => {
                          setQuery(search);
                          performSearch(search);
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular searches */}
              <div>
                <p className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2">
                  <TrendingUp className="w-3 h-3" />
                  Recherches populaires
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setQuery(search);
                        performSearch(search);
                      }}
                      className="px-3 py-1.5 bg-[#44D92C]/10 hover:bg-[#44D92C]/20 text-[#44D92C] rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Mobile search overlay
export function MobileSearchOverlay({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a]">
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <SearchAutocomplete 
          className="flex-1" 
          autoFocus 
          onClose={onClose}
        />
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
