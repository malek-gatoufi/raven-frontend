import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Package, ChevronRight, Bike } from 'lucide-react';
import { brandsApi, Brand, categoriesApi } from '@/lib/api-direct';

// Force le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getBrands(): Promise<Brand[]> {
  try {
    const data = await brandsApi.getAll();
    return data;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const data = await categoriesApi.getAll();
    return data;
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Nos Marques de Motos, Quads & Motoneiges',
  description: 'Trouvez les pièces détachées pour votre marque : Yamaha, Honda, Suzuki, Kawasaki, Polaris, Can-Am et plus. Livraison rapide en France.',
  keywords: 'pièces yamaha, pièces honda, pièces suzuki, pièces kawasaki, pièces polaris, pièces moto, pièces quad',
  openGraph: {
    title: 'Nos Marques | Raven Industries',
    description: 'Pièces détachées pour Yamaha, Honda, Suzuki, Kawasaki, Polaris et toutes les grandes marques.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

export default async function BrandsPage() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);
  const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0);
  
  // Filtrer les catégories principales (niveau 2)
  const mainCategories = categories.filter(c => c.level_depth === 2);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#44D92C]/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#44D92C]/10 flex items-center justify-center mx-auto mb-6">
              <Bike className="w-8 h-8 text-[#44D92C]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nos <span className="text-[#44D92C]">Marques</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Découvrez les pièces disponibles pour toutes les grandes marques de motos, quads, scooters et motoneiges.
            </p>
          </div>
        </div>
      </section>

      {/* Catégories avec images */}
      <section className="py-12 border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Par type de véhicule</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}-${cat.link_rewrite}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#44D92C]/50 transition-all"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                    <Bike className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#44D92C] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.nb_products && (
                    <p className="text-sm text-gray-400">{cat.nb_products.toLocaleString()} pièces</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-8 border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#44D92C]">{brands.length}</p>
              <p className="text-gray-400 text-sm mt-1">Marques</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{totalProducts.toLocaleString('fr-FR')}</p>
              <p className="text-gray-400 text-sm mt-1">Produits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des marques */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Toutes les marques</h2>
          {brands.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/marque/${brand.slug}`}
                    className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#44D92C]/50 transition-all"
                  >
                    {/* Image de la catégorie marque */}
                    <div className="aspect-[16/10] relative bg-[#0a0a0a]">
                      {brand.image ? (
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                          <span className="text-3xl font-bold text-gray-600 group-hover:text-[#44D92C] transition-colors">
                            {brand.name}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    
                    {/* Infos */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#44D92C] transition-colors">
                          {brand.name}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#44D92C] group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>{brand.categories.length} catégories</span>
                        <span>{brand.productCount.toLocaleString('fr-FR')} pièces</span>
                      </div>
                    </div>
                  </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bike className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Aucune marque disponible</h2>
              <p className="text-gray-400">Les marques seront bientôt ajoutées.</p>
            </div>
          )}
        </div>
      </section>

      {/* Devenir partenaire */}
      <section className="py-16 border-t border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Vous êtes une marque ?
            </h2>
            <p className="text-gray-400 mb-6">
              Rejoignez notre réseau de partenaires et bénéficiez d'une visibilité auprès de notre communauté.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Nous contacter
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
