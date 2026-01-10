/**
 * Composant de recherche en direct avec debounce
 * Optimisé pour les performances
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trackSearch } from '@/lib/analytics';

interface SearchResult {
  id: number;
  name: string;
  reference: string;
  price: number;
  image: string;
  category: string;
  url: string;
}

interface LiveSearchProps {
  placeholder?: string;
  debounceDelay?: number;
  minSearchLength?: number;
  maxResults?: number;
}

export function LiveSearch({
  placeholder = 'Rechercher un produit...',
  debounceDelay = 300,
  minSearchLength = 2,
  maxResults = 8,
}: LiveSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fonction de recherche avec debounce
   */
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < minSearchLength) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Créer un nouveau AbortController
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);

        const response = await fetch(
          `/ravenapi/search?q=${encodeURIComponent(searchQuery)}&limit=${maxResults}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.products || []);
        
        // Track la recherche dans GA4
        if (searchQuery) {
          trackSearch(searchQuery);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay),
    [debounceDelay, minSearchLength, maxResults]
  );

  /**
   * Effect pour gérer les changements de query
   */
  useEffect(() => {
    if (query) {
      debouncedSearch(query);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }

    return () => {
      // Cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, debouncedSearch]);

  /**
   * Gestion du clic en dehors du composant
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Gestion de la sélection d'un résultat
   */
  const handleSelectResult = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    router.push(result.url);
  };

  /**
   * Gestion du submit du formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/recherche?q=${encodeURIComponent(query)}`);
    }
  };

  /**
   * Effacer la recherche
   */
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-9 pr-20"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Résultats de recherche */}
      {isOpen && query.length >= minSearchLength && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-md border bg-popover shadow-lg">
          <div className="max-h-[400px] overflow-y-auto">
            {results.length === 0 && !isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucun résultat trouvé
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                  Produits
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className="flex w-full items-center gap-3 rounded-md p-3 hover:bg-accent"
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Réf: {result.reference}
                      </div>
                    </div>
                    <div className="font-semibold">
                      {result.price.toFixed(2)} €
                    </div>
                  </button>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/recherche?q=${encodeURIComponent(query)}`);
                  }}
                >
                  Voir tous les résultats pour &quot;{query}&quot;
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Fonction utilitaire de debounce
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Version compacte pour le header mobile
 */
export function LiveSearchCompact(props: LiveSearchProps) {
  return (
    <div className="w-full">
      <LiveSearch {...props} />
    </div>
  );
}
