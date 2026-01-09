'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Package, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: Array<{
    id: number;
    url: string;
    legend?: string;
  }>;
  name: string;
  coverImage?: string;
  productName?: string; // Deprecated, use name
}

export function ProductGallery({ images, name, coverImage, productName }: ProductGalleryProps) {
  const displayName = name || productName || 'Produit';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // Build array of images, use coverImage as fallback
  const allImages = images.length > 0 
    ? images 
    : coverImage 
      ? [{ id: 0, url: coverImage, legend: displayName }]
      : [];

  const hasMultipleImages = allImages.length > 1;

  function goToNext() {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  }

  function goToPrevious() {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/10">
        <Package className="w-24 h-24 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div 
        className="relative aspect-square bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in"
        onClick={() => setShowLightbox(true)}
      >
        <Image
          src={allImages[activeIndex].url}
          alt={allImages[activeIndex].legend || displayName}
          fill
          className="object-contain p-4"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
          Cliquer pour agrandir
        </div>

        {/* Navigation arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                index === activeIndex
                  ? 'border-[#44D92C] ring-2 ring-[#44D92C]/20'
                  : 'border-white/10 hover:border-white/30'
              )}
            >
              <Image
                src={image.url}
                alt={image.legend || `${displayName} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-lg z-10"
          >
            Fermer ✕
          </button>
          
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={allImages[activeIndex].url}
              alt={allImages[activeIndex].legend || displayName}
              fill
              className="object-contain"
            />
          </div>

          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
                    className={cn(
                      'w-3 h-3 rounded-full transition-all',
                      index === activeIndex ? 'bg-[#44D92C] scale-110' : 'bg-white/30 hover:bg-white/50'
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
