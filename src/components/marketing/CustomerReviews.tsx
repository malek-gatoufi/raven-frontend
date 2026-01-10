'use client';

import { Star } from 'lucide-react';

interface CustomerReview {
  id: number;
  name: string;
  rating: 5;
  comment: string;
  date: string;
  verified: boolean;
}

const reviews: CustomerReview[] = [
  {
    id: 1,
    name: "Thomas M.",
    rating: 5,
    comment: "Livraison ultra rapide et pièces conformes à la description. Je recommande vivement !",
    date: "Il y a 2 jours",
    verified: true
  },
  {
    id: 2,
    name: "Sophie L.",
    rating: 5,
    comment: "Excellent service client, ils m'ont aidé à trouver la pièce exacte pour mon scooter.",
    date: "Il y a 5 jours",
    verified: true
  },
  {
    id: 3,
    name: "Marc D.",
    rating: 5,
    comment: "Prix imbattables et qualité au rendez-vous. Mon 3ème achat sur ce site !",
    date: "Il y a 1 semaine",
    verified: true
  },
  {
    id: 4,
    name: "Julie P.",
    rating: 5,
    comment: "Pieces d'origine, bien emballées. Parfait pour l'entretien de ma moto.",
    date: "Il y a 2 semaines",
    verified: true
  }
];

export function CustomerReviews() {
  const averageRating = 4.8;
  const totalReviews = 2847;

  return (
    <section className="py-16 md:py-24 bg-white/[0.02]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-[#44D92C] text-[#44D92C]"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">{averageRating}/5</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Avis de nos clients
          </h2>
          <p className="text-[#999]">
            Basé sur <span className="text-[#44D92C] font-semibold">{totalReviews.toLocaleString('fr-FR')}</span> avis vérifiés
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#1a1a1a]/80 border border-white/10 rounded-2xl p-6 hover:border-[#44D92C]/50 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[#44D92C] text-[#44D92C]"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                "{review.comment}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-white font-medium text-sm">{review.name}</p>
                  {review.verified && (
                    <p className="text-xs text-[#44D92C]">✓ Achat vérifié</p>
                  )}
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#44D92C]/10 flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-white font-semibold">+50 000</p>
              <p className="text-sm text-gray-400">Clients satisfaits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#44D92C]/10 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="text-white font-semibold">99,2%</p>
              <p className="text-sm text-gray-400">Livraisons réussies</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#44D92C]/10 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <p className="text-white font-semibold">24-48h</p>
              <p className="text-sm text-gray-400">Livraison express</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
