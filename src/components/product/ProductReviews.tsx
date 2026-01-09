'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  Loader2,
  MessageSquare,
  Send,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: number;
  rating: number;
  title: string;
  content: string;
  author: string;
  date: string;
  helpful: { yes: number; no: number };
  verified_purchase: boolean;
}

interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<number, number>;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

const API_BASE = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

function StarRating({ 
  rating, 
  size = 'md', 
  interactive = false,
  onChange 
}: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={cn(
            "transition-transform",
            interactive && "hover:scale-110 cursor-pointer"
          )}
        >
          <Star 
            className={cn(
              sizes[size],
              (hoverRating || rating) >= star 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-600'
            )} 
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const formattedDate = new Date(review.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="border-b border-white/10 py-6 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} size="sm" />
            {review.verified_purchase && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="w-3 h-3" />
                Achat vérifié
              </span>
            )}
          </div>
          
          {review.title && (
            <h4 className="font-semibold mb-2">{review.title}</h4>
          )}
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {review.content}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>{review.author}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">Utile ?</span>
              <button className="flex items-center gap-1 text-gray-400 hover:text-green-500 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpful.yes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                <ThumbsDown className="w-4 h-4" />
                <span>{review.helpful.no}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingDistribution({ stats }: { stats: ReviewStats }) {
  const maxCount = Math.max(...Object.values(stats.distribution));
  
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = stats.distribution[rating] || 0;
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <span className="w-3">{rating}</span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-right text-gray-500">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, average: 0, distribution: {} });
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  async function loadReviews() {
    try {
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=reviews&id_product=${productId}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews || []);
          setStats(data.stats);
          setCanReview(data.can_review);
          setHasReviewed(data.has_reviewed);
        }
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (rating === 0) {
      toast.warning('Veuillez sélectionner une note');
      return;
    }
    
    if (content.length < 10) {
      toast.warning('Votre avis doit contenir au moins 10 caractères');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=reviews`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id_product: productId,
            rating,
            title,
            content,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setShowForm(false);
        setRating(0);
        setTitle('');
        setContent('');
        loadReviews(); // Reload reviews
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Impossible d\'envoyer votre avis');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#44D92C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats summary */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Average rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="text-5xl font-bold text-[#44D92C]">
              {stats.average.toFixed(1)}
            </span>
            <div>
              <StarRating rating={Math.round(stats.average)} size="lg" />
              <p className="text-gray-400 mt-1">
                {stats.total} avis client{stats.total > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        
        {/* Distribution */}
        <RatingDistribution stats={stats} />
      </div>

      {/* Write review button */}
      {isAuthenticated && canReview && !showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Donner mon avis
        </Button>
      )}
      
      {hasReviewed && (
        <p className="text-gray-400 text-sm">
          ✓ Vous avez déjà laissé un avis pour ce produit
        </p>
      )}
      
      {!isAuthenticated && (
        <p className="text-gray-400 text-sm">
          <a href="/connexion" className="text-[#44D92C] hover:underline">
            Connectez-vous
          </a> pour laisser un avis
        </p>
      )}

      {/* Review form */}
      {showForm && (
        <Card className="bg-[#1a1a1a]/80 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Votre avis sur {productName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Note *</label>
                <StarRating 
                  rating={rating} 
                  size="lg" 
                  interactive 
                  onChange={setRating} 
                />
              </div>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Titre (optionnel)</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Résumez votre avis en quelques mots"
                  className="bg-white/5 border-white/10"
                  maxLength={100}
                />
              </div>
              
              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Votre avis *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#44D92C] focus:ring-1 focus:ring-[#44D92C] resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}/2000 caractères
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Publier mon avis
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div>
          <h3 className="font-semibold mb-4">Tous les avis</h3>
          <div className="divide-y divide-white/10">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            Aucun avis pour le moment. Soyez le premier à donner votre opinion !
          </p>
        </div>
      )}
    </div>
  );
}
