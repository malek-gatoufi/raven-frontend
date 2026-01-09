import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

interface CmsPageItem {
  id: number;
  title: string;
  description: string;
  slug: string;
  category_id: number;
  category_name: string;
  url: string;
}

async function getCmsPages(): Promise<CmsPageItem[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://www.ravenindustries.fr'}/index.php?fc=module&module=ravenapi&controller=cms&action=list`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.pages : [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Informations légales | Raven Industries',
  description: 'Consultez nos pages d\'informations légales : CGV, mentions légales, politique de confidentialité et plus encore.',
};

export default async function CmsListPage() {
  const pages = await getCmsPages();
  
  // Grouper par catégorie
  const groupedPages = pages.reduce((acc, page) => {
    const category = page.category_name || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(page);
    return acc;
  }, {} as Record<string, CmsPageItem[]>);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#44D92C]/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Informations <span className="text-[#44D92C]">légales</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Retrouvez toutes les informations concernant nos conditions générales, notre politique de confidentialité et plus encore.
            </p>
          </div>
        </div>
      </section>

      {/* Liste des pages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {Object.keys(groupedPages).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedPages).map(([category, categoryPages]) => (
                  <div key={category}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#44D92C]/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#44D92C]" />
                      </span>
                      {category}
                    </h2>
                    
                    <div className="space-y-4">
                      {categoryPages.map((page) => (
                        <Link
                          key={page.id}
                          href={`/cms/${page.slug}`}
                          className="group block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#44D92C]/50 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-white group-hover:text-[#44D92C] transition-colors">
                                {page.title}
                              </h3>
                              {page.description && (
                                <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                                  {page.description}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#44D92C] group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-white mb-2">Aucune page disponible</h2>
                <p className="text-gray-400">Les pages légales seront bientôt disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Liens rapides */}
      <section className="py-12 border-t border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-white mb-6">Liens rapides</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/cms/conditions-generales-de-vente"
                className="text-gray-400 hover:text-[#44D92C] transition-colors text-sm"
              >
                Conditions Générales de Vente
              </Link>
              <Link
                href="/cms/mentions-legales"
                className="text-gray-400 hover:text-[#44D92C] transition-colors text-sm"
              >
                Mentions légales
              </Link>
              <Link
                href="/cms/politique-de-confidentialite"
                className="text-gray-400 hover:text-[#44D92C] transition-colors text-sm"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-[#44D92C] transition-colors text-sm"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
