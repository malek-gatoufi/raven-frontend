/**
 * Composant Image optimisé avec lazy loading et placeholder
 */

'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<NextImageProps, 'placeholder'> {
  fallbackSrc?: string;
  showPlaceholder?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/placeholder.png',
  showPlaceholder = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showPlaceholder && isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      <NextImage
        src={error ? fallbackSrc : src}
        alt={alt}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0',
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}

/**
 * Image produit avec ratio optimisé
 */
export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('aspect-square object-cover', className)}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={85}
      priority={priority}
      {...props}
    />
  );
}

/**
 * Image de catégorie
 */
export function CategoryImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('aspect-square rounded-lg object-cover', className)}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
      quality={80}
      {...props}
    />
  );
}

/**
 * Image de hero/bannière
 */
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('w-full object-cover', className)}
      sizes="100vw"
      quality={90}
      priority
      {...props}
    />
  );
}

/**
 * Avatar utilisateur
 */
export function AvatarImage({
  src,
  alt,
  className,
  size = 40,
  ...props
}: OptimizedImageProps & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full object-cover', className)}
      quality={75}
      {...props}
    />
  );
}

/**
 * Thumbnail pour vignettes
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('h-20 w-20 rounded-md object-cover', className)}
      width={80}
      height={80}
      quality={70}
      {...props}
    />
  );
}
