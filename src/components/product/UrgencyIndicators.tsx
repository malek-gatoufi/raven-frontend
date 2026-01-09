'use client';

import { useState, useEffect } from 'react';
import { 
  Flame, 
  Eye, 
  ShoppingBag, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Composant de stock limité
interface LowStockIndicatorProps {
  quantity: number;
  threshold?: number;
  className?: string;
}

export function LowStockIndicator({ 
  quantity, 
  threshold = 10, 
  className 
}: LowStockIndicatorProps) {
  if (quantity <= 0) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-red-500 text-sm font-medium",
        className
      )}>
        <AlertTriangle className="w-4 h-4" />
        <span>Rupture de stock</span>
      </div>
    );
  }

  if (quantity <= threshold) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-orange-500 text-sm font-medium animate-pulse",
        className
      )}>
        <Flame className="w-4 h-4" />
        <span>Plus que {quantity} en stock !</span>
      </div>
    );
  }

  return null;
}

// Barre de progression du stock
interface StockProgressBarProps {
  quantity: number;
  maxQuantity?: number;
  className?: string;
}

export function StockProgressBar({ 
  quantity, 
  maxQuantity = 50, 
  className 
}: StockProgressBarProps) {
  const percentage = Math.min((quantity / maxQuantity) * 100, 100);
  
  let barColor = 'bg-green-500';
  if (percentage <= 20) barColor = 'bg-red-500';
  else if (percentage <= 50) barColor = 'bg-orange-500';

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Disponibilité</span>
        <span>{quantity} en stock</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Indicateur de ventes récentes
interface RecentSalesIndicatorProps {
  productId: number;
  className?: string;
}

export function RecentSalesIndicator({ 
  productId, 
  className 
}: RecentSalesIndicatorProps) {
  const [sales, setSales] = useState<number | null>(null);

  useEffect(() => {
    // Simuler des ventes récentes basées sur l'ID produit
    // En production, récupérer depuis l'API
    const fakeSales = Math.floor((productId % 20) + 5);
    setSales(fakeSales);
  }, [productId]);

  if (!sales || sales < 3) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm text-green-400",
      className
    )}>
      <ShoppingBag className="w-4 h-4" />
      <span>{sales} vendus cette semaine</span>
    </div>
  );
}

// Indicateur de visiteurs en temps réel
interface LiveViewersIndicatorProps {
  productId: number;
  className?: string;
}

export function LiveViewersIndicator({ 
  productId, 
  className 
}: LiveViewersIndicatorProps) {
  const [viewers, setViewers] = useState<number>(0);

  useEffect(() => {
    // Simuler des visiteurs en temps réel
    // En production, utiliser WebSocket ou polling
    const baseViewers = (productId % 8) + 2;
    setViewers(baseViewers);

    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(1, Math.min(prev + change, 15));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [productId]);

  if (viewers < 3) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm text-blue-400",
      className
    )}>
      <Eye className="w-4 h-4 animate-pulse" />
      <span>{viewers} personnes regardent ce produit</span>
    </div>
  );
}

// Badge produit tendance
interface TrendingBadgeProps {
  salesRank?: number;
  className?: string;
}

export function TrendingBadge({ salesRank, className }: TrendingBadgeProps) {
  if (!salesRank || salesRank > 10) return null;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full text-xs font-medium text-orange-400",
      className
    )}>
      <TrendingUp className="w-3 h-3" />
      <span>Top {salesRank} des ventes</span>
    </div>
  );
}

// Badge vente flash
interface FlashSaleBadgeProps {
  endDate?: Date | string;
  discount: number;
  className?: string;
}

export function FlashSaleBadge({ endDate, discount, className }: FlashSaleBadgeProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!endDate) return;

    const end = new Date(endDate).getTime();
    
    const updateTimer = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Terminé');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}j ${hours % 24}h`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg text-sm font-bold text-white",
      className
    )}>
      <Zap className="w-4 h-4" />
      <span>-{discount}%</span>
      {timeLeft && (
        <>
          <span className="w-px h-4 bg-white/30" />
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{timeLeft}</span>
        </>
      )}
    </div>
  );
}

// Confiance clients
interface CustomerTrustProps {
  className?: string;
}

export function CustomerTrust({ className }: CustomerTrustProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-sm text-gray-400",
      className
    )}>
      <Users className="w-4 h-4" />
      <span>Plus de 10 000 clients satisfaits</span>
    </div>
  );
}

// Badge "Meilleure vente"
interface BestSellerBadgeProps {
  categoryName?: string;
  className?: string;
}

export function BestSellerBadge({ categoryName, className }: BestSellerBadgeProps) {
  return (
    <div className={cn(
      "absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded-full shadow-lg",
      className
    )}>
      <Flame className="w-3 h-3" />
      <span>Best-seller{categoryName ? ` ${categoryName}` : ''}</span>
    </div>
  );
}

// Composant combiné pour page produit
interface ProductUrgencyProps {
  quantity: number;
  productId: number;
  hasDiscount?: boolean;
  discountEndDate?: Date | string;
  discountPercent?: number;
  salesRank?: number;
  className?: string;
}

export function ProductUrgency({
  quantity,
  productId,
  hasDiscount,
  discountEndDate,
  discountPercent = 0,
  salesRank,
  className
}: ProductUrgencyProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Flash sale timer */}
      {hasDiscount && discountPercent >= 10 && (
        <FlashSaleBadge 
          discount={discountPercent} 
          endDate={discountEndDate}
        />
      )}

      {/* Trending badge */}
      <TrendingBadge salesRank={salesRank} />

      {/* Stock indicator */}
      <LowStockIndicator quantity={quantity} />

      {/* Social proof */}
      <div className="flex flex-wrap gap-4">
        <RecentSalesIndicator productId={productId} />
        <LiveViewersIndicator productId={productId} />
      </div>
    </div>
  );
}

export default ProductUrgency;
