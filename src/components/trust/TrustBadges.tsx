'use client';

import { 
  Truck, 
  Shield, 
  CreditCard, 
  HeadphonesIcon, 
  RefreshCw,
  Award,
  Clock,
  CheckCircle,
  Star,
  Lock,
  Package,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Trust badges bar for header/footer
interface TrustBadgesBarProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  className?: string;
}

const trustItems = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Expédition sous 24h',
    highlight: 'Gratuite dès 50€',
  },
  {
    icon: RefreshCw,
    title: 'Retours gratuits',
    description: '30 jours pour changer d\'avis',
    highlight: 'Satisfait ou remboursé',
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'SSL & 3D Secure',
    highlight: 'CB, PayPal, Virement',
  },
  {
    icon: HeadphonesIcon,
    title: 'Service client',
    description: 'Experts à votre écoute',
    highlight: 'Du lundi au samedi',
  },
];

export function TrustBadgesBar({ variant = 'horizontal', className }: TrustBadgesBarProps) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-6 py-4", className)}>
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-center gap-2 text-sm">
            <item.icon className="w-5 h-5 text-[#44D92C]" />
            <span className="text-gray-400">{item.highlight}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-12 h-12 bg-[#44D92C]/10 rounded-xl flex items-center justify-center">
              <item.icon className="w-6 h-6 text-[#44D92C]" />
            </div>
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.description}</p>
              <span className="text-xs text-[#44D92C]">{item.highlight}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 py-8 border-y border-white/5",
      className
    )}>
      {trustItems.map((item) => (
        <div key={item.title} className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#44D92C]/10 rounded-2xl mb-4">
            <item.icon className="w-7 h-7 text-[#44D92C]" />
          </div>
          <h4 className="font-semibold mb-1">{item.title}</h4>
          <p className="text-sm text-gray-400">{item.description}</p>
          <span className="text-xs text-[#44D92C] font-medium">{item.highlight}</span>
        </div>
      ))}
    </div>
  );
}

// Payment methods icons
export function PaymentMethods({ className }: { className?: string }) {
  const methods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'PayPal', icon: '🅿️' },
    { name: 'Apple Pay', icon: '🍎' },
    { name: 'Google Pay', icon: '🔵' },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Lock className="w-4 h-4 text-gray-500" />
      <span className="text-xs text-gray-500 mr-2">Paiement sécurisé</span>
      {methods.map((method) => (
        <div
          key={method.name}
          className="w-10 h-6 bg-white/5 rounded flex items-center justify-center text-xs"
          title={method.name}
        >
          {method.icon}
        </div>
      ))}
    </div>
  );
}

// Product page trust section
interface ProductTrustSectionProps {
  inStock?: boolean;
  freeShipping?: boolean;
  warranty?: string;
  className?: string;
}

export function ProductTrustSection({ 
  inStock = true, 
  freeShipping = true,
  warranty = '2 ans',
  className 
}: ProductTrustSectionProps) {
  const features = [
    {
      icon: inStock ? CheckCircle : Clock,
      text: inStock ? 'En stock - Expédition sous 24h' : 'Livraison sous 5-7 jours',
      color: inStock ? 'text-[#44D92C]' : 'text-orange-500',
    },
    {
      icon: Truck,
      text: freeShipping ? 'Livraison gratuite' : 'Livraison dès 4,90€',
      color: freeShipping ? 'text-[#44D92C]' : 'text-gray-400',
    },
    {
      icon: Shield,
      text: `Garantie ${warranty}`,
      color: 'text-[#44D92C]',
    },
    {
      icon: RefreshCw,
      text: 'Retour gratuit sous 30 jours',
      color: 'text-[#44D92C]',
    },
  ];

  return (
    <div className={cn("space-y-3 p-4 bg-[#1a1a1a]/50 rounded-xl border border-white/5", className)}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-3">
          <feature.icon className={cn("w-5 h-5", feature.color)} />
          <span className="text-sm">{feature.text}</span>
        </div>
      ))}
    </div>
  );
}

// Customer reviews summary badge
interface ReviewBadgeProps {
  rating: number;
  count: number;
  showStars?: boolean;
  className?: string;
}

export function ReviewBadge({ rating, count, showStars = true, className }: ReviewBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showStars && (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < Math.floor(rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : i < rating
                    ? "text-yellow-500 fill-yellow-500/50"
                    : "text-gray-600"
              )}
            />
          ))}
        </div>
      )}
      <span className="font-bold">{rating.toFixed(1)}</span>
      <span className="text-gray-400 text-sm">({count} avis)</span>
    </div>
  );
}

// Verified purchase badge
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 bg-[#44D92C]/10 text-[#44D92C] text-xs font-medium rounded-full",
      className
    )}>
      <CheckCircle className="w-3 h-3" />
      Achat vérifié
    </span>
  );
}

// Pro/Expert badge
export function ExpertBadge({ type = 'expert' }: { type?: 'expert' | 'pro' | 'premium' }) {
  const configs = {
    expert: { icon: Award, text: 'Expert', bg: 'bg-blue-500/10', color: 'text-blue-400' },
    pro: { icon: Zap, text: 'Pro', bg: 'bg-purple-500/10', color: 'text-purple-400' },
    premium: { icon: Star, text: 'Premium', bg: 'bg-amber-500/10', color: 'text-amber-400' },
  };

  const config = configs[type];

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
      config.bg,
      config.color
    )}>
      <config.icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}

// Quality guarantee section
export function QualityGuarantee({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-[#44D92C]/10 to-transparent border border-[#44D92C]/20 rounded-2xl p-6",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-[#44D92C]/20 rounded-2xl flex items-center justify-center">
          <Award className="w-8 h-8 text-[#44D92C]" />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2">Garantie Qualité Raven</h4>
          <p className="text-gray-400 text-sm mb-4">
            Toutes nos pièces sont authentiques et soigneusement sélectionnées. 
            Nous garantissons leur conformité et leur qualité.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-[#44D92C]">
              <CheckCircle className="w-4 h-4" />
              Pièces d'origine
            </span>
            <span className="flex items-center gap-1.5 text-[#44D92C]">
              <CheckCircle className="w-4 h-4" />
              Garantie 2 ans
            </span>
            <span className="flex items-center gap-1.5 text-[#44D92C]">
              <CheckCircle className="w-4 h-4" />
              SAV réactif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats/Numbers section
export function TrustStats({ className }: { className?: string }) {
  const stats = [
    { value: '50K+', label: 'Clients satisfaits' },
    { value: '100K+', label: 'Pièces vendues' },
    { value: '4.8/5', label: 'Note moyenne' },
    { value: '48h', label: 'Délai moyen' },
  ];

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-6", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl md:text-4xl font-black text-[#44D92C] mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default TrustBadgesBar;
