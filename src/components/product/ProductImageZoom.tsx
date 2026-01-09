'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface ProductImage {
  id: number;
  small: string;
  medium: string;
  large: string;
}

interface ProductImageZoomProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductImageZoom({ images, productName, className }: ProductImageZoomProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  
  const imageRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex] || {
    id: 0,
    small: '/placeholder.webp',
    medium: '/placeholder.webp',
    large: '/placeholder.webp',
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, []);

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image with zoom */}
      <div className="relative group">
        <div
          ref={imageRef}
          className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* Normal image */}
          <Image
            src={currentImage.large}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            className="object-contain transition-opacity duration-200"
            style={{ opacity: isZoomed ? 0 : 1 }}
            priority
          />

          {/* Zoomed image */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              isZoomed ? "opacity-100" : "opacity-0"
            )}
            style={{
              backgroundImage: `url(${currentImage.large})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Zoom indicator */}
          <div className={cn(
            "absolute top-4 right-4 p-2 bg-black/50 rounded-full transition-opacity",
            isZoomed ? "opacity-0" : "opacity-100 group-hover:opacity-100"
          )}>
            <ZoomIn className="w-5 h-5 text-white" />
          </div>

          {/* Fullscreen button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 className="w-5 h-5 text-white" />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                currentIndex === index
                  ? "border-[#44D92C] ring-2 ring-[#44D92C]/30"
                  : "border-transparent hover:border-white/30"
              )}
            >
              <Image
                src={image.small}
                alt={`${productName} - Miniature ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog
        open={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/95" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full h-full max-w-7xl">
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Main lightbox image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full h-[80vh]">
                <Image
                  src={currentImage.large}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-8 h-8 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-8 h-8 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-xl backdrop-blur-sm">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                      currentIndex === index
                        ? "border-[#44D92C]"
                        : "border-transparent hover:border-white/50"
                    )}
                  >
                    <Image
                      src={image.small}
                      alt={`Miniature ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default ProductImageZoom;
