'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { productsApi, categoriesApi } from '@/lib/api-direct';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { Product, Category, SearchFilters } from '@/types/prestashop';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingCart,
  Grid3X3,
  List,
  ArrowUpDown,
  Check,
  Loader2,
} from 'lucide-react';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    in_stock: searchParams.get('in_stock') === 'true',
    on_sale: searchParams.get('on_sale') === 'true',
    sort: (searchParams.get('sort') as SearchFilters['sort']) || 'relevance',
  });
  
  // UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    availability: true,
  });
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Charger les catégories
  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  // Recherche
  const performSearch = useCallback(async () => {
    if (!query.trim() && !filters.category) return;
    
    setIsLoading(true);
    try {
      const response = await productsApi.search(query, {
        ...filters,
        page: currentPage,
        limit: 24,
      });
      setProducts(response.data);
      setTotalResults(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error('Search error:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, currentPage]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Mise à jour URL
  const updateURL = useCallback((newQuery: string, newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newFilters.category) params.set('category', String(newFilters.category));
    if (newFilters.min_price) params.set('min_price', String(newFilters.min_price));
    if (newFilters.max_price) params.set('max_price', String(newFilters.max_price));
    if (newFilters.in_stock) params.set('in_stock', 'true');
    if (newFilters.on_sale) params.set('on_sale', 'true');
    if (newFilters.sort && newFilters.sort !== 'relevance') params.set('sort', newFilters.sort);
    
    router.push(`/recherche?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL(query, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(query, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = { sort: 'relevance' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateURL(query, clearedFilters);
  };

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      await addItem(product.id, 1);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setTimeout(() => setAddingToCart(null), 1000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const activeFiltersCount = [
    filters.category,
    filters.min_price,
    filters.max_price,
    filters.in_stock,
    filters.on_sale,
  ].filter(Boolean).length;

  const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'name_asc', label: 'Nom A-Z' },
    { value: 'name_desc', label: 'Nom Z-A' },
    { value: 'date_desc', label: 'Nouveautés' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barre de recherche */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit, une référence..."
            className="pl-14 pr-32 h-14 text-lg bg-[#1a1a1a] border-white/10 focus:border-[#44D92C] rounded-xl"
          />
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold h-10 px-6"
          >
            Rechercher
          </Button>
        </form>
      </div>

      {/* Résultats header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          {query && (
            <h1 className="text-2xl font-bold">
              Résultats pour &quot;{query}&quot;
            </h1>
          )}
          <p className="text-gray-400">
            {isLoading ? 'Recherche...' : `${totalResults} produit${totalResults > 1 ? 's' : ''} trouvé${totalResults > 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Bouton filtres mobile */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden border-white/10"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ml-2 w-5 h-5 bg-[#44D92C] text-black rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {/* Tri */}
          <div className="relative">
            <select
              value={filters.sort || 'relevance'}
              onChange={(e) => handleFilterChange('sort', e.target.value as SearchFilters['sort'])}
              className="appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm focus:border-[#44D92C] outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Vue grid/list */}
          <div className="hidden md:flex items-center gap-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#44D92C] text-black' : 'text-gray-500 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#44D92C] text-black' : 'text-gray-500 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filtres */}
        <aside className={`
          ${showFilters ? 'fixed inset-0 z-50 bg-[#0a0a0a] p-4 overflow-auto' : 'hidden'}
          md:block md:relative md:w-64 md:flex-shrink-0
        `}>
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-xl font-bold">Filtres</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full mb-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
            >
              Effacer les filtres ({activeFiltersCount})
            </button>
          )}

          {/* Catégories */}
          <div className="mb-6">
            <button
              onClick={() => setExpandedFilters(f => ({ ...f, categories: !f.categories }))}
              className="flex items-center justify-between w-full py-2 font-semibold"
            >
              Catégories
              {expandedFilters.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedFilters.categories && (
              <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                <button
                  onClick={() => handleFilterChange('category', undefined)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    !filters.category ? 'bg-[#44D92C]/20 text-[#44D92C]' : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  Toutes les catégories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleFilterChange('category', cat.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      filters.category === cat.id ? 'bg-[#44D92C]/20 text-[#44D92C]' : 'hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {cat.name}
                    {cat.nb_products && <span className="ml-2 text-xs opacity-60">({cat.nb_products})</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prix */}
          <div className="mb-6">
            <button
              onClick={() => setExpandedFilters(f => ({ ...f, price: !f.price }))}
              className="flex items-center justify-between w-full py-2 font-semibold"
            >
              Prix
              {expandedFilters.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedFilters.price && (
              <div className="mt-2 flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-white/5 border-white/10 text-sm"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-white/5 border-white/10 text-sm"
                />
              </div>
            )}
          </div>

          {/* Disponibilité */}
          <div className="mb-6">
            <button
              onClick={() => setExpandedFilters(f => ({ ...f, availability: !f.availability }))}
              className="flex items-center justify-between w-full py-2 font-semibold"
            >
              Disponibilité
              {expandedFilters.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedFilters.availability && (
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.in_stock || false}
                    onChange={(e) => handleFilterChange('in_stock', e.target.checked || undefined)}
                    className="rounded border-white/20 bg-white/5 text-[#44D92C] focus:ring-[#44D92C]"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white">En stock uniquement</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.on_sale || false}
                    onChange={(e) => handleFilterChange('on_sale', e.target.checked || undefined)}
                    className="rounded border-white/20 bg-white/5 text-[#44D92C] focus:ring-[#44D92C]"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white">En promotion</span>
                </label>
              </div>
            )}
          </div>

          {/* Bouton appliquer mobile */}
          <Button
            onClick={() => setShowFilters(false)}
            className="w-full md:hidden bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold mt-4"
          >
            Voir les résultats
          </Button>
        </aside>

        {/* Grille produits */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Aucun résultat</h2>
              <p className="text-gray-400 mb-6">
                Essayez avec d&apos;autres mots-clés ou modifiez vos filtres
              </p>
              <Button onClick={clearFilters} variant="outline" className="border-white/10">
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                : 'space-y-4'
              }>
                {products.map((product) => (
                  viewMode === 'grid' ? (
                    <Card key={product.id} className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden group hover:border-[#44D92C]/50 transition-all">
                      <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                        <div className="relative aspect-square bg-white/5">
                          {product.cover_image ? (
                            <Image
                              src={product.cover_image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-gray-500" />
                            </div>
                          )}
                          {product.on_sale && product.reduction > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{Math.round(product.reduction * 100)}%
                            </span>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-3">
                        <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                          <h3 className="font-medium text-sm line-clamp-2 hover:text-[#44D92C] transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        {product.reference && (
                          <p className="text-xs text-gray-500 mt-1">{product.reference}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <p className="font-bold text-[#44D92C]">{formatPrice(product.price)}</p>
                            {product.price_without_reduction > product.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(product.price_without_reduction)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart === product.id || !product.available_for_order}
                            className="w-9 h-9 flex items-center justify-center bg-[#44D92C] hover:bg-[#3bc425] text-black rounded-lg transition-all disabled:opacity-50"
                          >
                            {addingToCart === product.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card key={product.id} className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden hover:border-[#44D92C]/50 transition-all">
                      <div className="flex gap-4 p-4">
                        <Link href={`/product/${product.id}-${product.link_rewrite}`} className="relative w-32 h-32 flex-shrink-0">
                          <div className="relative w-full h-full bg-white/5 rounded-lg overflow-hidden">
                            {product.cover_image ? (
                              <Image
                                src={product.cover_image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                            <h3 className="font-semibold text-lg hover:text-[#44D92C] transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          {product.reference && (
                            <p className="text-sm text-gray-500">Réf: {product.reference}</p>
                          )}
                          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                            {product.description_short?.replace(/<[^>]*>/g, '')}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                              <p className="text-xl font-bold text-[#44D92C]">{formatPrice(product.price)}</p>
                              {product.price_without_reduction > product.price && (
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.price_without_reduction)}
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={addingToCart === product.id || !product.available_for_order}
                              className="bg-[#44D92C] hover:bg-[#3bc425] text-black"
                            >
                              {addingToCart === product.id ? (
                                <><Check className="w-4 h-4 mr-2" /> Ajouté</>
                              ) : (
                                <><ShoppingCart className="w-4 h-4 mr-2" /> Ajouter</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-white/10"
                  >
                    Précédent
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let page: number;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page 
                              ? 'bg-[#44D92C] text-black' 
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-white/10"
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 border-4 border-[#44D92C] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
