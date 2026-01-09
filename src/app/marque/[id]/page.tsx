'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Bike, Search, Filter, Package } from 'lucide-react';

interface Model {
  id: number;
  name: string;
  link_rewrite: string;
  product_count: number;
  category_type: string;
  image: string | null;
  url: string;
}

interface BrandCategory {
  id: number;
  name: string;
  link_rewrite: string;
  image: string | null;
}

interface BrandData {
  brand: {
    name: string;
    slug: string;
    image: string | null;
  };
  categories: BrandCategory[];
  models: Model[];
}

async function getBrandModels(slug: string): Promise<BrandData | null> {
  try {
    const res = await fetch(`https://ravenindustries.fr/api.php?action=brand-models&brand=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (data.success) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export default function BrandPage({ params }: { params: Promise<{ id: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    params.then((p) => setSlug(p.id));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    getBrandModels(slug).then((data) => {
      setBrandData(data);
      setLoading(false);
    });
  }, [slug]);

  // Types de véhicules disponibles
  const vehicleTypes = useMemo(() => {
    if (!brandData) return [];
    const types = new Set(brandData.models.map(m => m.category_type).filter(Boolean));
    return Array.from(types);
  }, [brandData]);

  // Modèles filtrés
  const filteredModels = useMemo(() => {
    if (!brandData) return [];
    
    return brandData.models.filter(model => {
      const matchesSearch = searchQuery === '' || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || 
        model.category_type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [brandData, searchQuery, selectedType]);

  // Grouper par première lettre du modèle (après le nom de marque)
  const groupedModels = useMemo(() => {
    const groups: Record<string, Model[]> = {};
    
    filteredModels.forEach(model => {
      // Extraire le nom du modèle (après "Marque ")
      const parts = model.name.split(' ');
      const modelName = parts.slice(1).join(' ') || model.name;
      const firstLetter = modelName.charAt(0).toUpperCase();
      
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(model);
    });
    
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredModels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#44D92C]"></div>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Bike className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Marque introuvable</h1>
          <p className="text-gray-400 mb-6">Cette marque n&apos;existe pas ou n&apos;a pas de modèles.</p>
          <Link
            href="/marque"
            className="inline-flex items-center gap-2 bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Voir toutes les marques
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero avec image de la marque */}
      <section className="relative py-16 overflow-hidden">
        {brandData.brand.image && (
          <div className="absolute inset-0">
            <Image
              src={brandData.brand.image}
              alt={brandData.brand.name}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/marque" className="hover:text-white transition-colors">Marques</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#44D92C]">{brandData.brand.name}</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pièces <span className="text-[#44D92C]">{brandData.brand.name}</span>
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Trouvez les pièces détachées pour votre {brandData.brand.name}. 
              {brandData.models.length} modèles disponibles.
            </p>

            {/* Types de véhicules */}
            {brandData.categories.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {brandData.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}-${cat.link_rewrite}`}
                    className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#44D92C]/50 rounded-lg px-4 py-2 transition-colors"
                  >
                    {cat.image && (
                      <div className="relative w-8 h-8 rounded overflow-hidden">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                    )}
                    <span className="text-white">{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filtres et recherche */}
      <section className="py-6 border-b border-[#2a2a2a] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#44D92C]/50"
              />
            </div>

            {/* Filtre par type */}
            {vehicleTypes.length > 1 && (
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#44D92C]/50"
                >
                  <option value="all">Tous les types</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 text-sm text-gray-400">
            {filteredModels.length} modèle{filteredModels.length > 1 ? 's' : ''} trouvé{filteredModels.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Liste des modèles groupés par lettre */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {groupedModels.length > 0 ? (
            <div className="space-y-12">
              {groupedModels.map(([letter, models]) => (
                <div key={letter}>
                  <h2 className="text-2xl font-bold text-[#44D92C] mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-[#44D92C]/10 flex items-center justify-center">
                      {letter}
                    </span>
                    <span className="text-gray-500 text-sm font-normal">
                      {models.length} modèle{models.length > 1 ? 's' : ''}
                    </span>
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {models.map((model) => (
                      <Link
                        key={model.id}
                        href={model.url}
                        className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#44D92C]/50 transition-all"
                      >
                        {/* Image du modèle */}
                        <div className="aspect-[16/10] relative bg-[#0a0a0a]">
                          {model.image ? (
                            <Image
                              src={model.image}
                              alt={model.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                              <Bike className="w-12 h-12 text-gray-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {model.category_type && (
                            <span className="absolute top-2 left-2 text-xs bg-[#44D92C]/90 text-black font-medium px-2 py-1 rounded">
                              {model.category_type}
                            </span>
                          )}
                        </div>
                        
                        {/* Infos */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-white font-medium group-hover:text-[#44D92C] transition-colors line-clamp-2 flex-1">
                              {model.name}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#44D92C] group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Package className="w-4 h-4" />
                            <span>{model.product_count} pièce{model.product_count > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bike className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Aucun modèle trouvé</h2>
              <p className="text-gray-400">Essayez de modifier votre recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* Retour aux marques */}
      <section className="py-8 border-t border-[#2a2a2a]">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/marque"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#44D92C] transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Retour à toutes les marques
          </Link>
        </div>
      </section>
    </div>
  );
}
