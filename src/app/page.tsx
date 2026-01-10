import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bike, Waves, Snowflake, Zap, Shield, Truck, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productsApi, categoriesApi } from '@/lib/api-direct';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import { ProductImage } from '@/components/ui/optimized-image';
import { CustomerReviews } from '@/components/marketing/CustomerReviews';
import type { Product, Category } from '@/types/prestashop';
import { Suspense } from 'react';

// Force le rendu dynamique à chaque requête
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Icons pour les catégories principales
const categoryIcons: Record<string, typeof Bike> = {
  'moto': Bike,
  'quad': Bike,
  'jet-ski': Waves,
  'jet': Waves,
  'motoneige': Snowflake,
  'scooter': Bike,
};

const categoryColors: Record<string, string> = {
  'moto': '#44D92C',
  'quad': '#f59e0b',
  'jet-ski': '#3b82f6',
  'jet': '#3b82f6',
  'motoneige': '#8b5cf6',
  'scooter': '#ec4899',
};

// Fetch data server-side
async function getHomeData() {
  try {
    const [categories, products] = await Promise.all([
      categoriesApi.getAll(2).catch(() => []),
      productsApi.getAll({ limit: 12 }).catch(() => ({ data: [] })),
    ]);
    
    return { 
      categories, 
      newProducts: products.data?.slice(0, 8) || [],
      bestSellers: products.data?.slice(0, 4) || [],
      onSale: products.data?.filter((p: Product) => p.on_sale).slice(0, 4) || [],
    };
  } catch {
    return { categories: [], newProducts: [], bestSellers: [], onSale: [] };
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.on_sale && product.reduction > 0;
  return (
    <Card className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden group hover:border-[#44D92C]/50 transition-all duration-300">
      <Link href={`/product/${product.id}-${product.link_rewrite}`}>
        <div className="relative aspect-square bg-white/5 overflow-hidden">
          {product.cover_image ? (
            <ProductImage
              src={product.cover_image}
              alt={product.name}
              width={400}
              height={400}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-600" />
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round(product.reduction * 100)}%
            </span>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
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
            {hasDiscount && product.price_without_reduction > product.price && (
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
  );
}

// Marques partenaires
const brands = [
  'Brembo', 'Michelin', 'Akrapovic', 'K&N', 'DID', 'Motul', 'NGK', 'Renthal'
];

export default async function HomePage() {
  const { categories, newProducts, bestSellers, onSale } = await getHomeData();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center hero-section overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#44D92C]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#44D92C]/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#44D92C]/10 border border-[#44D92C]/30 text-[#44D92C] text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Plus de 30 000 références en stock
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Pièces détachées pour
              <span className="block text-[#44D92C]">
                Moto • Quad • Jet-Ski • Motoneige
              </span>
            </h1>
            
            <p className="text-xl text-[#999] mb-8 max-w-2xl">
              Spécialiste de la pièce détachée depuis 2010. 
              Qualité premium, prix compétitifs, livraison express.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/recherche">
                <Button size="lg" className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold px-8 h-14 text-lg">
                  Explorer le catalogue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/recherche?on_sale=true">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 hover:border-[#44D92C] h-14 text-lg">
                  Voir les promos
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
              <div>
                <span className="text-3xl font-bold text-[#44D92C]">30k+</span>
                <p className="text-sm text-[#999]">Références</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-white">15</span>
                <p className="text-sm text-[#999]">Ans d&apos;expertise</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-white">50k+</span>
                <p className="text-sm text-[#999]">Clients satisfaits</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-white">24h</span>
                <p className="text-sm text-[#999]">Expédition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choisissez votre véhicule
            </h2>
            <p className="text-[#999] text-lg max-w-2xl mx-auto">
              Trouvez rapidement les pièces adaptées à votre machine
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.length > 0 ? categories.slice(0, 4).map((cat) => {
              const slug = cat.link_rewrite.toLowerCase();
              const Icon = categoryIcons[slug] || Package;
              const color = categoryColors[slug] || '#44D92C';
              
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}-${cat.link_rewrite}`}
                  className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a]/80 border border-white/10 hover:border-[#44D92C]/50 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#44D92C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative p-8">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="h-8 w-8" style={{ color }} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#44D92C] transition-colors">
                      {cat.name}
                    </h3>
                    
                    {cat.description && (
                      <p className="text-[#999] mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: cat.description }} />
                    )}
                    
                    <div className="flex items-center justify-between">
                      {cat.nb_products && (
                        <span className="text-sm text-[#666]">
                          {cat.nb_products.toLocaleString()} pièces
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-sm font-medium" style={{ color }}>
                        Explorer
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }) : (
              ['Moto', 'Quad', 'Jet-Ski', 'Motoneige'].map((name) => (
                <div
                  key={name}
                  className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a]/80 border border-white/10 p-8"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-[#44D92C]/20">
                    <Bike className="h-8 w-8 text-[#44D92C]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
                  <p className="text-[#999]">Pièces détachées {name.toLowerCase()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-8 bg-[#44D92C]/5 border-y border-[#44D92C]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-[#44D92C]" />
              <span className="text-white font-medium">Livraison 24-48h</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#44D92C]" />
              <span className="text-white font-medium">Garantie 2 ans</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-[#44D92C]" />
              <span className="text-white font-medium">30 000+ références</span>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Nouveautés
                </h2>
                <p className="text-[#999]">
                  Les derniers produits ajoutés au catalogue
                </p>
              </div>
              <Link href="/recherche?sort=date_desc">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 hover:border-[#44D92C]">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* On Sale Section */}
      {onSale.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-red-500/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-3">
                  <Star className="h-4 w-4" />
                  Promotions
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Bonnes affaires
                </h2>
                <p className="text-[#999]">
                  Profitez de nos réductions exceptionnelles
                </p>
              </div>
              <Link href="/recherche?on_sale=true">
                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {onSale.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands Section */}
      <section className="py-16 md:py-24 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nos marques partenaires
            </h2>
            <p className="text-[#999]">
              Uniquement des pièces de qualité certifiée
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/recherche?q=${encodeURIComponent(brand)}`}
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl bg-white/5 border border-white/10 text-[#999] font-semibold hover:bg-[#44D92C]/10 hover:border-[#44D92C]/30 hover:text-[#44D92C] transition-all"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#44D92C]/20 to-[#44D92C]/5 border border-[#44D92C]/30 p-8 md:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#44D92C]/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Vous ne trouvez pas votre pièce ?
              </h2>
              <p className="text-lg text-[#999] mb-8">
                Nos experts sont là pour vous aider. Envoyez-nous votre demande 
                et nous trouverons la pièce qu&apos;il vous faut.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold">
                    Nous contacter
                  </Button>
                </Link>
                <a href="tel:+33123456789">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                    01 23 45 67 89
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
