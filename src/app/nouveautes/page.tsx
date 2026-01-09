import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Package, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from '@/components/product/AddToCartButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Nouveautés Pièces Moto & Quad',
  description: 'Découvrez les dernières pièces détachées moto, quad, scooter et motoneige. Nouveaux arrivages chaque semaine. Livraison rapide en France.',
  keywords: 'nouveautés pièces moto, nouvelles pièces quad, arrivages pièces détachées, nouveaux produits',
  openGraph: {
    title: 'Nouveautés | Raven Industries',
    description: 'Les dernières pièces détachées pour moto, quad, scooter et motoneige.',
    images: ['/og-image.png'],
  },
};

interface Product {
  id: number;
  name: string;
  description_short: string;
  link_rewrite: string;
  price: number;
  reference: string;
  in_stock: boolean;
  quantity: number;
  on_sale: boolean;
  cover_image: string | null;
  url: string;
  date_add: string;
}

async function getNouveautes(page: number = 1): Promise<{ data: Product[]; pagination: { total: number; page: number; per_page: number; total_pages: number } }> {
  try {
    const apiUrl = process.env.PRESTASHOP_INTERNAL_URL || process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://www.ravenindustries.fr';
    const res = await fetch(`${apiUrl}/api.php?action=nouveautes&page=${page}&limit=24&days=90`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    return { data: [], pagination: { total: 0, page: 1, per_page: 24, total_pages: 0 } };
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

export default async function NouveautesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { data: products, pagination } = await getNouveautes(currentPage);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#44D92C]/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#44D92C]/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-[#44D92C]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-[#44D92C]">Nouveautés</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Découvrez nos derniers produits ajoutés au catalogue
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#44D92C]">{pagination.total}</p>
              <p className="text-gray-400 text-sm">Nouveaux produits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <Card 
                    key={product.id} 
                    className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden group hover:border-[#44D92C]/50 transition-all"
                  >
                    <Link href={product.url}>
                      <div className="relative aspect-square bg-white/5 overflow-hidden">
                        {product.cover_image ? (
                          <Image
                            src={product.cover_image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-600" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-[#44D92C] text-black text-xs font-bold px-2 py-1 rounded">
                          NOUVEAU
                        </span>
                        {product.on_sale && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            PROMO
                          </span>
                        )}
                      </div>
                    </Link>
                    
                    <CardContent className="p-3">
                      <Link href={product.url}>
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
                          {product.date_add && (
                            <p className="text-xs text-gray-500">{formatDate(product.date_add)}</p>
                          )}
                        </div>
                        <AddToCartButton 
                          productId={product.id} 
                          disabled={!product.in_stock}
                          compact
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Link
                    href={`/nouveautes?page=${currentPage - 1}`}
                    className={`px-4 py-2 rounded-lg border border-white/10 transition-colors ${
                      currentPage <= 1 ? 'opacity-50 pointer-events-none' : 'hover:border-[#44D92C]'
                    }`}
                  >
                    Précédent
                  </Link>
                  
                  <span className="px-4 py-2 text-gray-400">
                    Page {currentPage} / {pagination.total_pages}
                  </span>

                  <Link
                    href={`/nouveautes?page=${currentPage + 1}`}
                    className={`px-4 py-2 rounded-lg border border-white/10 transition-colors ${
                      currentPage >= pagination.total_pages ? 'opacity-50 pointer-events-none' : 'hover:border-[#44D92C]'
                    }`}
                  >
                    Suivant
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Aucune nouveauté récente</h2>
              <p className="text-gray-400 mb-6">De nouveaux produits arrivent bientôt</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Retour à l'accueil
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
