'use client';

import { useEffect, useState } from 'react';
import { categoriesApi } from '@/lib/api';
import { cache } from '@/lib/cache';
import type { Category } from '@/types/prestashop';

const CACHE_KEY = 'main_categories';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Hook pour récupérer les catégories principales avec cache
 */
export function useCachedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        
        // Essayer de récupérer depuis le cache
        const cached = cache.get<Category[]>(CACHE_KEY, { strategy: 'localStorage' });
        
        if (cached) {
          setCategories(cached);
          setIsLoading(false);
          return;
        }

        // Si pas en cache, appeler l'API
        const data = await categoriesApi.getMain();
        
        // Mettre en cache
        cache.set(CACHE_KEY, data, {
          strategy: 'localStorage',
          ttl: CACHE_TTL,
        });
        
        setCategories(data);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to load categories:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, isLoading, error };
}

/**
 * Hook générique pour cacher les produits
 */
export function useCachedProducts<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes par défaut
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Essayer de récupérer depuis le cache
        const cached = cache.get<T>(key, { strategy: 'sessionStorage' });
        
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }

        // Si pas en cache, appeler le fetcher
        const result = await fetcher();
        
        // Mettre en cache
        cache.set(key, result, {
          strategy: 'sessionStorage',
          ttl,
        });
        
        setData(result);
      } catch (err) {
        setError(err as Error);
        console.error(`Failed to load data for ${key}:`, err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [key, ttl]);

  return { data, isLoading, error };
}

/**
 * Fonction pour invalider le cache des catégories
 */
export function invalidateCategoriesCache() {
  cache.delete(CACHE_KEY, { strategy: 'localStorage' });
}

/**
 * Fonction pour précharger les catégories en cache
 */
export async function preloadCategories() {
  try {
    const data = await categoriesApi.getMain();
    cache.set(CACHE_KEY, data, {
      strategy: 'localStorage',
      ttl: CACHE_TTL,
    });
    return data;
  } catch (error) {
    console.error('Failed to preload categories:', error);
    return [];
  }
}
