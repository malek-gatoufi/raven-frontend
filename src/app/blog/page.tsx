import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - Conseils & Tutoriels Moto, Quad, Jet-Ski | Raven Industries',
  description:
    "Guides d'entretien, tutoriels de réparation et conseils d'experts pour moto, quad, jet-ski et motoneige. Tous nos articles techniques.",
  keywords:
    'blog moto, tutoriel entretien, réparation quad, guide technique, conseils mécaniques, maintenance véhicule',
  openGraph: {
    title: 'Blog Technique Raven Industries',
    description: "Guides et tutoriels pour l'entretien de votre véhicule",
    type: 'website',
  },
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

// Articles de blog (à terme, à charger depuis une API/CMS)
const blogPosts: BlogPost[] = [
  {
    slug: 'comment-changer-plaquettes-frein-moto',
    title: 'Comment changer les plaquettes de frein de votre moto ?',
    excerpt:
      'Guide complet pas-à-pas pour remplacer vos plaquettes de frein en toute sécurité. Outillage nécessaire, précautions et astuces de pro.',
    image: '/images/blog/plaquettes-frein.jpg',
    category: 'Tutoriel',
    author: 'Thomas Mécanique',
    date: '2026-01-08',
    readTime: '8 min',
    featured: true,
  },
  {
    slug: 'entretien-quad-calendrier-complet',
    title: "Calendrier complet d'entretien de votre quad",
    excerpt:
      "Planning détaillé des révisions : vidange, filtres, freins, batterie. Ne ratez plus aucun entretien avec notre checklist complète.",
    image: '/images/blog/entretien-quad.jpg',
    category: 'Entretien',
    author: 'Sophie Rider',
    date: '2026-01-05',
    readTime: '12 min',
    featured: true,
  },
  {
    slug: 'top-10-pieces-usure-verifier',
    title: "Top 10 des pièces d'usure à vérifier avant l'été",
    excerpt:
      "La saison arrive ! Découvrez les 10 pièces essentielles à inspecter pour rouler en toute sécurité : pneus, freins, chaîne, liquides...",
    image: '/images/blog/pieces-usure.jpg',
    category: 'Conseils',
    author: 'Marc Expert',
    date: '2026-01-03',
    readTime: '6 min',
  },
  {
    slug: 'hivernage-motoneige-guide-complet',
    title: 'Hivernage de votre motoneige : le guide complet',
    excerpt:
      'Protégez votre motoneige pendant la saison chaude. Vidange, carburant, batterie, bâche : tous nos conseils pour un hivernage parfait.',
    image: '/images/blog/hivernage-motoneige.jpg',
    category: 'Saisonnier',
    author: 'Jean Nordique',
    date: '2025-12-28',
    readTime: '10 min',
  },
  {
    slug: 'nettoyer-carburateur-scooter',
    title: 'Nettoyer un carburateur de scooter en 5 étapes',
    excerpt:
      'Votre scooter cale au ralenti ? Le carburateur est peut-être encrassé. Tutoriel simple pour le nettoyer sans démontage complet.',
    image: '/images/blog/carburateur.jpg',
    category: 'Tutoriel',
    author: 'Thomas Mécanique',
    date: '2025-12-20',
    readTime: '7 min',
  },
  {
    slug: 'choisir-huile-moteur-quad',
    title: 'Comment choisir la bonne huile moteur pour votre quad ?',
    excerpt:
      'Synthèse, semi-synthèse, minérale : quelle huile pour votre quad ? Viscosité, normes API, fréquence de vidange... On vous explique tout.',
    image: '/images/blog/huile-moteur.jpg',
    category: 'Conseils',
    author: 'Sophie Rider',
    date: '2025-12-15',
    readTime: '9 min',
  },
];

const categories = ['Tous', 'Tutoriel', 'Entretien', 'Conseils', 'Saisonnier'];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Blog <span className="text-[#44D92C]">Raven Industries</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Guides techniques, tutoriels de réparation et conseils d'experts pour l'entretien de vos
          véhicules
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un article, un tutoriel..."
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#44D92C]/50 focus:ring-2 focus:ring-[#44D92C]/20"
          />
        </div>
      </div>

      {/* Categories filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              category === 'Tous'
                ? 'bg-[#44D92C] text-black'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-[#44D92C]">⭐</span> Articles à la une
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden hover:border-[#44D92C]/50 transition-all hover:shadow-lg hover:shadow-[#44D92C]/10"
              >
                <div className="relative h-64 bg-[#2a2a2a]">
                  {/* Placeholder pour image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🔧</div>
                      <div className="text-sm">Image à venir</div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#44D92C] text-black text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#44D92C] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Regular posts */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Tous les articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden hover:border-[#44D92C]/50 transition-all hover:shadow-lg hover:shadow-[#44D92C]/10"
            >
              <div className="relative h-48 bg-[#2a2a2a]">
                {/* Placeholder pour image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <div className="text-4xl">🛠️</div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-[#44D92C]/90 text-black text-xs font-semibold rounded">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#44D92C] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[#44D92C] text-sm font-medium group-hover:gap-3 transition-all">
                  Lire l'article
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#44D92C]/20 to-[#44D92C]/5 border border-[#44D92C]/30 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ne ratez aucun article !
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Recevez nos nouveaux tutoriels et guides techniques directement dans votre boîte mail.
          1 email par semaine maximum.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre email"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#44D92C]/50 focus:ring-2 focus:ring-[#44D92C]/20"
          />
          <button className="px-6 py-3 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold rounded-lg transition-colors">
            S'abonner
          </button>
        </div>
      </div>
    </div>
  );
}
