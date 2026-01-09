'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  buttonText?: string;
}

interface HeroProps {
  slides?: HeroSlide[];
}

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Bienvenue chez Raven Industries',
    subtitle: 'Découvrez notre sélection de produits de qualité',
    image: '/images/hero-1.jpg',
    link: '/category/nouveautes',
    buttonText: 'Découvrir',
  },
];

export function Hero({ slides = defaultSlides }: HeroProps) {
  const slide = slides[0]; // For now, just use first slide

  return (
    <section className="relative h-[60vh] min-h-[400px] max-h-[600px] bg-muted overflow-hidden">
      {/* Background image */}
      {slide.image && (
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      
      {/* Fallback gradient if no image */}
      {!slide.image && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {slide.subtitle}
            </p>
          )}
          <Link href={slide.link}>
            <Button size="lg" className="text-lg">
              {slide.buttonText || 'Découvrir'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
