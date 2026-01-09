'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: number;
  attributeId?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'icon' | 'button';
}

export function WishlistButton({ 
  productId, 
  attributeId = 0,
  className,
  size = 'md',
  showLabel = false,
  variant = 'icon'
}: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const inWishlist = isInWishlist(productId, attributeId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsAnimating(true);
    await toggleWishlist(productId, attributeId);
    
    // Animation de feedback
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'border-white/20 hover:border-[#44D92C] transition-all',
          inWishlist && 'border-red-500 bg-red-500/10',
          className
        )}
      >
        <Heart 
          className={cn(
            iconSizes[size],
            'transition-all duration-300',
            inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400',
            isAnimating && 'scale-125'
          )} 
        />
        {showLabel && (
          <span className="ml-2">
            {inWishlist ? 'Dans les favoris' : 'Ajouter aux favoris'}
          </span>
        )}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200',
        'bg-black/50 backdrop-blur-sm hover:bg-black/70',
        'border border-white/10 hover:border-white/30',
        sizeClasses[size],
        inWishlist && 'border-red-500/50 bg-red-500/20',
        isAnimating && 'scale-110',
        className
      )}
      aria-label={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={!isAuthenticated ? 'Connectez-vous pour ajouter aux favoris' : (inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris')}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-all duration-300',
          inWishlist ? 'fill-red-500 text-red-500' : 'text-white/70 hover:text-white',
          isAnimating && 'animate-pulse'
        )} 
      />
    </button>
  );
}

// Composant pour afficher le compteur wishlist dans le header
export function WishlistCounter({ className }: { className?: string }) {
  const { count, isLoading } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || count === 0) return null;

  return (
    <span 
      className={cn(
        'absolute -top-1 -right-1 flex items-center justify-center',
        'min-w-[18px] h-[18px] rounded-full',
        'bg-red-500 text-white text-xs font-bold',
        'transition-transform',
        isLoading && 'animate-pulse',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
