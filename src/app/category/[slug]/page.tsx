import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, Grid3X3, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { productsApi, categoriesApi } from '@/lib/api-direct';
import type { Category } from '@/types/prestashop';
import type { Metadata } from 'next';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { CategoryFacets } from './CategoryFacets';

// Force le rendu dynamique à chaque requête
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 
    sort?: string; 
    page?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
    on_sale?: string;
    manufacturer?: string | string[];
  }>;
}

// Générer les métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const id = slug.split('-')[0];
  
  try {
    const category = await categoriesApi.getById(id);
    if (!category) {
      return { title: 'Catégorie non trouvée' };
    }
    
    const title = `Pièces ${category.name}`;
    const description = category.description 
      ? category.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Découvrez toutes nos pièces détachées pour ${category.name}. Large choix, prix compétitifs et livraison rapide.`;
    
    return {
      title,
      description,
      keywords: `pièces ${category.name.toLowerCase()}, ${category.name.toLowerCase()} pièces détachées, accessoires ${category.name.toLowerCase()}`,
      openGraph: {
        title: `Pièces ${category.name} | Raven Industries`,
        description,
        images: category.image ? [category.image] : ['/og-image.png'],
      },
    };
  } catch {
    return { title: 'Catégorie' };
  }
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const id = slug.split('-')[0];
    return await categoriesApi.getById(id);
  } catch {
    return null;
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    return await categoriesApi.getAll();
  } catch {
    return [];
  }
}

async function getProducts(categoryId: number, searchParams: Record<string, string | string[] | undefined>) {
  try {
    return await productsApi.getByCategory(categoryId, {
      page: searchParams.page ? Number(searchParams.page) : 1,
      limit: 24,
      sort: searchParams.sort as 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'date_desc' | undefined,
      min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
      max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
      in_stock: searchParams.in_stock === 'true',
      on_sale: searchParams.on_sale === 'true',
    });
  } catch {
    return { data: [], total: 0, page: 1, limit: 24, total_pages: 0 };
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  
  const [category, allCategories] = await Promise.all([
    getCategory(slug),
    getAllCategories(),
  ]);
  
  if (!category) {
    notFound();
  }

  const { data: products, total, total_pages } = await getProducts(category.id, search);
  const currentPage = Number(search.page) || 1;

  // Calculate price range from products
  const priceRange = products.length > 0 
    ? {
        min: Math.floor(Math.min(...products.map(p => p.price))),
        max: Math.ceil(Math.max(...products.map(p => p.price)))
      }
    : { min: 0, max: 1000 };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-[#44D92C] transition-colors whitespace-nowrap">Accueil</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="text-white font-medium whitespace-nowrap">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {category.image && (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5">
              <Image src={category.image} alt={category.name} fill className="object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
            <p className="text-gray-400">{total} produit{total > 1 ? 's' : ''}</p>
          </div>
        </div>
        {category.description && (
          <p className="text-gray-400 max-w-3xl" dangerouslySetInnerHTML={{ __html: category.description }} />
        )}
      </div>

      {/* Main content with facets */}
      <div className="flex gap-8">
        {/* Facet Navigation */}
        <CategoryFacets 
          categories={allCategories}
          currentCategory={category}
          priceRange={priceRange}
          totalProducts={total}
        />

        {/* Products area */}
        <div className="flex-1 min-w-0">
          {/* Sous-catégories */}
          {category.children && category.children.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Sous-catégories</h2>
              <div className="flex flex-wrap gap-2">
                {category.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/category/${child.id}-${child.link_rewrite}`}
                    className="px-3 py-1.5 bg-white/5 hover:bg-[#44D92C]/20 border border-white/10 hover:border-[#44D92C]/50 rounded-lg text-sm transition-all"
                  >
                    {child.name}
                    {child.nb_products && <span className="ml-1.5 text-xs text-gray-500">({child.nb_products})</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sort Bar */}
          <div className="flex items-center justify-between gap-4 mb-6 p-3 bg-[#1a1a1a]/50 rounded-xl border border-white/5">
            <p className="text-sm text-gray-500">{total} résultat{total > 1 ? 's' : ''}</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:inline">Trier:</span>
              <select 
                defaultValue={search.sort || 'name_asc'}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#44D92C] outline-none"
              >
                <option value="name_asc">Nom A-Z</option>
                <option value="name_desc">Nom Z-A</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="date_desc">Nouveautés</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-[#1a1a1a]/30 rounded-2xl border border-white/5">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Aucun produit trouvé</h2>
              <p className="text-gray-400 mb-4">Essayez de modifier vos filtres</p>
              <Link 
                href={`/category/${slug}`}
                className="text-[#44D92C] hover:underline"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden group hover:border-[#44D92C]/50 transition-all duration-300"
                >
                  <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                    <div className="relative aspect-square bg-white/5 overflow-hidden">
                      {product.cover_image ? (
                        <Image
                          src={product.cover_image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.on_sale && product.reduction > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{Math.round(product.reduction * 100)}%
                          </span>
                        )}
                        {product.quantity <= 0 && (
                          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">Rupture</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  <CardContent className="p-3">
                    <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                      <h3 className="font-medium text-sm line-clamp-2 min-h-[40px] hover:text-[#44D92C] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    {product.reference && (
                      <p className="text-xs text-gray-500 mt-1 font-mono">{product.reference}</p>
                    )}
                    <div className="flex items-end justify-between mt-3 gap-2">
                      <div>
                        <p className="text-lg font-bold text-[#44D92C]">{formatPrice(product.price)}</p>
                        {product.price_without_reduction > product.price && (
                          <p className="text-xs text-gray-500 line-through">{formatPrice(product.price_without_reduction)}</p>
                        )}
                      </div>
                      <AddToCartButton 
                        productId={product.id} 
                        disabled={!product.available_for_order || product.quantity <= 0}
                        compact
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Link
                href={`/category/${slug}?page=${currentPage - 1}${search.sort ? `&sort=${search.sort}` : ''}${search.min_price ? `&min_price=${search.min_price}` : ''}${search.max_price ? `&max_price=${search.max_price}` : ''}${search.in_stock ? '&in_stock=true' : ''}${search.on_sale ? '&on_sale=true' : ''}`}
                className={`px-4 py-2 rounded-lg border border-white/10 transition-colors ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : 'hover:border-[#44D92C]'}`}
              >
                Précédent
              </Link>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, total_pages))].map((_, i) => {
                  let pageNum = i + 1;
                  if (total_pages > 5) {
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= total_pages - 2) pageNum = total_pages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Link
                      key={pageNum}
                      href={`/category/${slug}?page=${pageNum}${search.sort ? `&sort=${search.sort}` : ''}${search.min_price ? `&min_price=${search.min_price}` : ''}${search.max_price ? `&max_price=${search.max_price}` : ''}${search.in_stock ? '&in_stock=true' : ''}${search.on_sale ? '&on_sale=true' : ''}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum ? 'bg-[#44D92C] text-black' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              <Link
                href={`/category/${slug}?page=${currentPage + 1}${search.sort ? `&sort=${search.sort}` : ''}${search.min_price ? `&min_price=${search.min_price}` : ''}${search.max_price ? `&max_price=${search.max_price}` : ''}${search.in_stock ? '&in_stock=true' : ''}${search.on_sale ? '&on_sale=true' : ''}`}
                className={`px-4 py-2 rounded-lg border border-white/10 transition-colors ${currentPage >= total_pages ? 'opacity-50 pointer-events-none' : 'hover:border-[#44D92C]'}`}
              >
                Suivant
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
