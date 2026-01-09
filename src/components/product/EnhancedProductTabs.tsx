'use client';

import { useState } from 'react';
import { 
  FileText, 
  Settings, 
  Star, 
  MessageSquare, 
  Truck,
  Shield,
  HelpCircle,
  ChevronDown,
  ThumbsUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Inline product interface to avoid import issues
interface TabsProduct {
  id: number;
  name: string;
  reference?: string;
  description?: string;
  description_short?: string;
  manufacturer_name?: string;
  ean13?: string;
  weight?: number;
  condition?: 'new' | 'used' | 'refurbished' | string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  verified?: boolean;
  helpful?: number;
  images?: string[];
}

interface EnhancedProductTabsProps {
  product: TabsProduct;
  reviews?: Review[];
  specifications?: Record<string, string>;
  onWriteReview?: () => void;
  className?: string;
}

type TabId = 'description' | 'specifications' | 'reviews' | 'shipping' | 'faq';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export function EnhancedProductTabs({ 
  product, 
  reviews = [], 
  specifications = {},
  onWriteReview,
  className 
}: EnhancedProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [mobileExpandedTabs, setMobileExpandedTabs] = useState<TabId[]>(['description']);

  const tabs: Tab[] = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'specifications', label: 'Caractéristiques', icon: Settings },
    { id: 'reviews', label: 'Avis clients', icon: Star, badge: reviews.length },
    { id: 'shipping', label: 'Livraison & Retours', icon: Truck },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  function toggleMobileTab(tabId: TabId) {
    setMobileExpandedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 
      : 0,
  }));

  const renderTabContent = (tabId: TabId) => {
    switch (tabId) {
      case 'description':
        return (
          <div className="space-y-6">
            {product.description_short && (
              <div 
                className="text-lg text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description_short }}
              />
            )}
            <div 
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: product.description || '<p>Aucune description disponible.</p>' }}
            />
          </div>
        );

      case 'specifications':
        const allSpecs: Record<string, string> = {
          'Référence': product.reference || '-',
          'Fabricant': product.manufacturer_name || '-',
          'EAN': product.ean13 || '-',
          'Poids': product.weight ? `${product.weight} kg` : '-',
          'Condition': product.condition === 'new' ? 'Neuf' : product.condition === 'used' ? 'Occasion' : product.condition || '-',
          ...specifications,
        };

        return (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {Object.entries(allSpecs).map(([key, value], index) => (
              <div 
                key={key}
                className={cn(
                  "flex justify-between py-4 px-5",
                  index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                )}
              >
                <span className="text-gray-400 font-medium">{key}</span>
                <span className="font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-8">
            {/* Reviews overview */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Score */}
              <div className="text-center p-8 bg-gradient-to-br from-[#44D92C]/10 to-transparent rounded-2xl border border-[#44D92C]/20">
                <div className="text-6xl font-black text-[#44D92C] mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={cn(
                        "w-6 h-6",
                        star <= Math.round(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      )}
                    />
                  ))}
                </div>
                <div className="text-gray-400">
                  Basé sur {reviews.length} avis
                </div>
              </div>

              {/* Right: Distribution */}
              <div className="space-y-3 flex flex-col justify-center">
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16 shrink-0">
                      <span className="text-sm font-medium">{stars}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-10">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write review button */}
            <div className="text-center">
              <button 
                onClick={onWriteReview}
                className="px-8 py-3 bg-[#44D92C] hover:bg-[#3bc425] text-black font-bold rounded-xl transition-colors"
              >
                <MessageSquare className="w-5 h-5 inline-block mr-2" />
                Écrire un avis
              </button>
            </div>

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Aucun avis pour le moment</h3>
                <p className="text-gray-400">
                  Soyez le premier à partager votre expérience avec ce produit !
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#44D92C]/20 rounded-full flex items-center justify-center text-[#44D92C] font-bold">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.author}</span>
                            {review.verified && (
                              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                ✓ Achat vérifié
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={cn(
                              "w-5 h-5",
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                    )}
                    
                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>

                    {/* Review images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {review.images.map((img, i) => (
                          <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-white/10">
                            <img 
                              src={img} 
                              alt={`Photo ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Helpful */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                      <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Utile ({review.helpful || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            {/* Shipping options */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">Standard</h4>
                    <p className="text-sm text-gray-400">3-5 jours ouvrés</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-400 mb-2">4,99 €</p>
                <p className="text-sm text-gray-400">Gratuit dès 100€ d'achat</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl border border-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Truck className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">Express</h4>
                    <p className="text-sm text-gray-400">24-48h</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-400 mb-2">9,99 €</p>
                <p className="text-sm text-gray-400">Commandez avant 14h</p>
              </div>
            </div>

            {/* Return policy */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl shrink-0">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Retours gratuits sous 30 jours</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-[#44D92C]">✓</span>
                      Retour gratuit en France métropolitaine
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#44D92C]">✓</span>
                      Remboursement intégral sous 14 jours
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#44D92C]">✓</span>
                      Emballage d'origine non requis si endommagé
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        const faqs = [
          {
            question: 'Ce produit est-il compatible avec mon véhicule ?',
            answer: 'Utilisez notre sélecteur de véhicule en haut de page pour vérifier la compatibilité. Si vous avez un doute, contactez notre service client avec le numéro de châssis de votre véhicule.',
          },
          {
            question: 'Quelle est la garantie ?',
            answer: 'Tous nos produits bénéficient d\'une garantie de 2 ans minimum. Les pièces d\'origine constructeur (OEM) sont couvertes par la garantie fabricant.',
          },
          {
            question: 'Est-ce une pièce d\'origine ou aftermarket ?',
            answer: `Cette référence est ${product.manufacturer_name ? `fabriquée par ${product.manufacturer_name}` : 'une pièce de qualité équivalente'}. La qualité OEM est garantie.`,
          },
          {
            question: 'Quand vais-je recevoir ma commande ?',
            answer: 'Les produits en stock sont expédiés sous 24h (jours ouvrés). La livraison standard prend 3-5 jours, l\'express 24-48h.',
          },
          {
            question: 'Puis-je retourner le produit ?',
            answer: 'Oui, vous disposez de 30 jours pour retourner tout produit non utilisé. Le retour est gratuit en France métropolitaine.',
          },
        ];

        return (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details 
                key={index}
                className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <summary className="p-5 cursor-pointer font-semibold flex items-center justify-between list-none hover:bg-white/5 transition-colors">
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 shrink-0 transform group-open:rotate-180 transition-transform text-[#44D92C]" />
                </summary>
                <div className="px-5 pb-5 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("", className)}>
      {/* Desktop tabs */}
      <div className="hidden md:block">
        {/* Tab headers */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all relative",
                activeTab === tab.id
                  ? "text-[#44D92C]"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-[#44D92C]/20 text-[#44D92C] text-xs font-bold rounded-full">
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#44D92C]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[400px]">
          {renderTabContent(activeTab)}
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden space-y-3">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => toggleMobileTab(tab.id)}
              className="flex items-center justify-between w-full p-4"
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5 text-[#44D92C]" />
                <span className="font-semibold">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-[#44D92C]/20 text-[#44D92C] text-xs font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <ChevronDown 
                className={cn(
                  "w-5 h-5 transition-transform text-gray-400",
                  mobileExpandedTabs.includes(tab.id) && "rotate-180"
                )}
              />
            </button>
            {mobileExpandedTabs.includes(tab.id) && (
              <div className="p-4 pt-0 border-t border-white/10">
                {renderTabContent(tab.id)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnhancedProductTabs;
