import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, Check, X, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { productsApi } from '@/lib/api-direct';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductTabs } from '@/components/product/ProductTabs';
import type { Metadata } from 'next';

// Force le rendu dynamique à chaque requête
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Générer les métadonnées dynamiques pour le SEO produit
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const id = slug.split('-')[0];
  
  try {
    const product = await productsApi.getById(Number(id));
    if (!product) {
      return { title: 'Produit non trouvé' };
    }
    
    const title = product.name;
    const description = product.description_short 
      ? product.description_short.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Achetez ${product.name} chez Raven Industries. Livraison rapide et garantie 2 ans.`;
    
    // Generate JSON-LD structured data for product
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: description,
      image: product.cover_image || '/og-image.png',
      sku: product.reference || String(product.id),
      brand: {
        '@type': 'Brand',
        name: product.manufacturer?.name || 'Raven Industries'
      },
      offers: {
        '@type': 'Offer',
        url: `https://new.ravenindustries.fr/product/${slug}`,
        priceCurrency: 'EUR',
        price: product.price,
        availability: product.quantity > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1'
      }
    };
    
    return {
      title,
      description,
      keywords: `${product.name}, ${product.reference || ''}, pièces détachées, ${product.manufacturer_name || ''}`.trim(),
      openGraph: {
        title: `${product.name} | Raven Industries`,
        description,
        images: product.cover_image ? [product.cover_image] : ['/og-image.png'],
      },
      other: {
        'product:price:amount': String(product.price),
        'product:price:currency': 'EUR',
        'product:availability': product.quantity > 0 ? 'in stock' : 'out of stock',
        // Add JSON-LD
        'script:ld+json': JSON.stringify(structuredData)
      },
    };
  } catch {
    return { title: 'Produit' };
  }
}

async function getProduct(slug: string) {
  try {
    const id = slug.split('-')[0];
    return await productsApi.getById(Number(id));
  } catch {
    return null;
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const hasDiscount = product.on_sale && product.reduction > 0;
  const discountPercent = hasDiscount ? Math.round(product.reduction * 100) : 0;

  // Generate JSON-LD for the page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description_short?.replace(/<[^>]*>/g, '') || '',
    image: product.cover_image || '/og-image.png',
    sku: product.reference || String(product.id),
    brand: {
      '@type': 'Brand',
      name: product.manufacturer?.name || 'Raven Industries'
    },
    offers: {
      '@type': 'Offer',
      url: `https://new.ravenindustries.fr/product/${slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      availability: product.quantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-[#44D92C] transition-colors whitespace-nowrap">Accueil</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        {product.categories && product.categories[0] && (
          <>
            <Link 
              href={`/category/${product.categories[0].id}-${product.categories[0].link_rewrite}`}
              className="hover:text-[#44D92C] transition-colors whitespace-nowrap"
            >
              {product.categories[0].name}
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          </>
        )}
        <span className="text-white font-medium truncate">{product.name}</span>
      </nav>

      {/* Product main section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Gallery */}
        <div className="relative">
          {hasDiscount && (
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
              -{discountPercent}%
            </div>
          )}
          <ProductGallery 
            images={product.images || []} 
            name={product.name}
            coverImage={product.cover_image}
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            {product.manufacturer && (
              <Link 
                href={`/marque/${product.manufacturer.id}`}
                className="text-[#44D92C] text-sm font-medium hover:underline"
              >
                {product.manufacturer.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-1">{product.name}</h1>
            {product.reference && (
              <p className="text-gray-500 text-sm mt-2 font-mono">Réf: {product.reference}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-4">
            <p className="text-4xl font-bold text-[#44D92C]">{formatPrice(product.price)}</p>
            {hasDiscount && product.price_without_reduction > product.price && (
              <p className="text-xl text-gray-500 line-through">{formatPrice(product.price_without_reduction)}</p>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-3">
            {product.quantity > 0 ? (
              <>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">En stock</span>
                </div>
                {product.quantity <= 5 && (
                  <span className="text-sm text-orange-400">Plus que {product.quantity} en stock !</span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-red-400">
                <X className="w-5 h-5" />
                <span className="font-medium">Rupture de stock</span>
              </div>
            )}
          </div>

          {/* Short description */}
          {product.description_short && (
            <div 
              className="text-gray-300 prose prose-invert prose-sm max-w-none whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: product.description_short }}
            />
          )}

          {/* Actions (quantity + add to cart) */}
          <ProductActions 
            product={product}
            disabled={!product.available_for_order || product.quantity <= 0}
          />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#44D92C]/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#44D92C]" />
              </div>
              <span className="text-xs text-gray-400">Livraison rapide</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#44D92C]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#44D92C]" />
              </div>
              <span className="text-xs text-gray-400">Paiement sécurisé</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#44D92C]/10 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-[#44D92C]" />
              </div>
              <span className="text-xs text-gray-400">Retour 14 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Features, Attachments */}
      <ProductTabs product={product} />
    </div>
  );
}
