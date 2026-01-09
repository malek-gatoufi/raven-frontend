'use client';

import { useState, useEffect } from 'react';
import { Clock, Zap, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  endDate: Date | string;
  title?: string;
  onComplete?: () => void;
  variant?: 'default' | 'compact' | 'banner';
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(endDate: Date): TimeLeft {
  const difference = endDate.getTime() - Date.now();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export function CountdownTimer({
  endDate,
  title = "Fin de l'offre dans",
  onComplete,
  variant = 'default',
  className
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    const updateTimer = () => {
      const time = calculateTimeLeft(end);
      setTimeLeft(time);
      
      if (time.total <= 0 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate, isComplete, onComplete]);

  if (!timeLeft) return null;

  if (isComplete) {
    return (
      <div className={cn("text-center", className)}>
        <span className="text-red-500 font-bold">Offre terminée</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Clock className="w-4 h-4 text-[#44D92C]" />
        <span className="font-mono font-bold">
          {timeLeft.days > 0 && `${timeLeft.days}j `}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={cn("flex items-center justify-center gap-4", className)}>
        <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
        <span className="font-medium">{title}</span>
        <div className="flex gap-1">
          {timeLeft.days > 0 && (
            <TimeUnit value={timeLeft.days} label="j" />
          )}
          <TimeUnit value={timeLeft.hours} label="h" />
          <TimeUnit value={timeLeft.minutes} label="m" />
          <TimeUnit value={timeLeft.seconds} label="s" />
        </div>
        <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("text-center", className)}>
      {title && (
        <p className="text-gray-400 text-sm mb-3 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          {title}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {timeLeft.days > 0 && (
          <TimeBlock value={timeLeft.days} label="Jours" />
        )}
        <TimeBlock value={timeLeft.hours} label="Heures" />
        <span className="text-2xl font-bold text-[#44D92C] animate-pulse">:</span>
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <span className="text-2xl font-bold text-[#44D92C] animate-pulse">:</span>
        <TimeBlock value={timeLeft.seconds} label="Secondes" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-[#44D92C] to-[#3bc425] text-black font-bold text-2xl md:text-4xl w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center shadow-lg shadow-[#44D92C]/20">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs md:text-sm text-gray-500 mt-2">{label}</span>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="bg-black/30 px-2 py-1 rounded font-mono font-bold">
      {String(value).padStart(2, '0')}{label}
    </span>
  );
}

// Flash Sale Banner
interface FlashSaleBannerProps {
  title?: string;
  subtitle?: string;
  endDate: Date | string;
  discountPercent?: number;
  link?: string;
  className?: string;
}

export function FlashSaleBanner({
  title = "VENTE FLASH",
  subtitle = "Profitez de réductions exceptionnelles !",
  endDate,
  discountPercent = 50,
  link = "/promotions",
  className
}: FlashSaleBannerProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-3",
      className
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      
      <div className="container mx-auto px-4 relative z-10">
        <a href={link} className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 animate-pulse" />
            <span className="font-black text-lg md:text-xl tracking-wider">
              {title}
            </span>
            <span className="px-3 py-1 bg-white text-red-600 font-black rounded-full text-sm animate-bounce">
              -{discountPercent}%
            </span>
          </div>
          
          <span className="hidden md:block w-px h-6 bg-white/30" />
          
          <span className="text-white/90">{subtitle}</span>
          
          <span className="hidden md:block w-px h-6 bg-white/30" />
          
          <CountdownTimer 
            endDate={endDate} 
            variant="banner"
            title=""
          />
        </a>
      </div>
    </div>
  );
}

// Promo Banner for homepage
interface PromoBannerProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  discountCode?: string;
  endDate?: Date | string;
  className?: string;
}

export function PromoBanner({
  title,
  description,
  buttonText = "En profiter",
  buttonLink = "/promotions",
  backgroundImage,
  discountCode,
  endDate,
  className
}: PromoBannerProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10",
      className
    )}>
      {/* Background image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#44D92C]/20 to-transparent" />
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-lg">
          <h3 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h3>
          
          {description && (
            <p className="text-gray-400 mb-6">{description}</p>
          )}
          
          {discountCode && (
            <div className="inline-flex items-center gap-3 bg-[#44D92C]/10 border border-[#44D92C]/30 rounded-lg px-4 py-2 mb-6">
              <span className="text-gray-400 text-sm">Code promo:</span>
              <span className="font-mono font-bold text-[#44D92C] text-lg">{discountCode}</span>
            </div>
          )}
          
          {endDate && (
            <div className="mb-6">
              <CountdownTimer endDate={endDate} variant="compact" />
            </div>
          )}
          
          <a
            href={buttonLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#44D92C] hover:bg-[#3bc425] text-black font-bold rounded-xl transition-colors"
          >
            {buttonText}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
