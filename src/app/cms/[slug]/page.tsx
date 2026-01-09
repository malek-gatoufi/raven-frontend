import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CmsPage {
  id: number;
  title: string;
  content: string;
  description: string;
  keywords: string;
  slug: string;
  category: {
    id: number;
    name: string;
  };
}

async function getCmsPage(slug: string): Promise<CmsPage | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://www.ravenindustries.fr'}/index.php?fc=module&module=ravenapi&controller=cms&action=get&slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } } // Cache 1 heure
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.page : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  
  if (!page) {
    return {
      title: 'Page non trouvée | Raven Industries',
    };
  }
  
  return {
    title: `${page.title} | Raven Industries`,
    description: page.description || page.title,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
    },
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  
  if (!page) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden border-b border-[#2a2a2a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#44D92C]/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {page.category?.name && (
              <span className="inline-block text-[#44D92C] text-sm font-medium mb-4">
                {page.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {page.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <article 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-[#44D92C] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:marker:text-[#44D92C]
                prose-blockquote:border-l-[#44D92C] prose-blockquote:text-gray-400
                prose-table:border-[#2a2a2a]
                prose-th:text-white prose-th:bg-[#1a1a1a] prose-th:p-3
                prose-td:text-gray-300 prose-td:border-[#2a2a2a] prose-td:p-3"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </section>

      {/* Pied de page CMS */}
      <section className="py-8 border-t border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</span>
            {page.category?.name && (
              <>
                <span>•</span>
                <span>Catégorie : {page.category.name}</span>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
