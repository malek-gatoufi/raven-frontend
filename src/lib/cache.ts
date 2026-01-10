/**
 * Système de cache optimisé pour le frontend
 * Supporte localStorage, sessionStorage et cache mémoire
 * Avec TTL (Time To Live) et invalidation intelligente
 */

export type CacheStrategy = 'memory' | 'localStorage' | 'sessionStorage';

export interface CacheOptions {
  strategy?: CacheStrategy;
  ttl?: number; // Time to live en millisecondes
  prefix?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly defaultPrefix = 'raven_cache_';

  /**
   * Stocke une valeur dans le cache
   */
  set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): void {
    const {
      strategy = 'memory',
      ttl = this.defaultTTL,
      prefix = this.defaultPrefix,
    } = options;

    const cacheKey = prefix + key;
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
    };

    switch (strategy) {
      case 'localStorage':
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(entry));
          } catch (e) {
            console.warn('localStorage not available:', e);
            this.memoryCache.set(cacheKey, entry);
          }
        }
        break;

      case 'sessionStorage':
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(entry));
          } catch (e) {
            console.warn('sessionStorage not available:', e);
            this.memoryCache.set(cacheKey, entry);
          }
        }
        break;

      case 'memory':
      default:
        this.memoryCache.set(cacheKey, entry);
        break;
    }
  }

  /**
   * Récupère une valeur du cache
   */
  get<T>(
    key: string,
    options: CacheOptions = {}
  ): T | null {
    const {
      strategy = 'memory',
      prefix = this.defaultPrefix,
    } = options;

    const cacheKey = prefix + key;
    let entry: CacheEntry<T> | null = null;

    switch (strategy) {
      case 'localStorage':
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem(cacheKey);
            if (stored) {
              entry = JSON.parse(stored);
            }
          } catch (e) {
            console.warn('Error reading from localStorage:', e);
          }
        }
        break;

      case 'sessionStorage':
        if (typeof window !== 'undefined') {
          try {
            const stored = sessionStorage.getItem(cacheKey);
            if (stored) {
              entry = JSON.parse(stored);
            }
          } catch (e) {
            console.warn('Error reading from sessionStorage:', e);
          }
        }
        break;

      case 'memory':
      default:
        entry = this.memoryCache.get(cacheKey) || null;
        break;
    }

    // Vérifier si l'entrée est expirée
    if (entry) {
      const age = Date.now() - entry.timestamp;
      if (age > entry.ttl) {
        this.delete(key, options);
        return null;
      }
      return entry.data;
    }

    return null;
  }

  /**
   * Supprime une clé du cache
   */
  delete(key: string, options: CacheOptions = {}): void {
    const {
      strategy = 'memory',
      prefix = this.defaultPrefix,
    } = options;

    const cacheKey = prefix + key;

    switch (strategy) {
      case 'localStorage':
        if (typeof window !== 'undefined') {
          localStorage.removeItem(cacheKey);
        }
        break;

      case 'sessionStorage':
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(cacheKey);
        }
        break;

      case 'memory':
      default:
        this.memoryCache.delete(cacheKey);
        break;
    }
  }

  /**
   * Vide complètement le cache
   */
  clear(options: CacheOptions = {}): void {
    const {
      strategy = 'memory',
      prefix = this.defaultPrefix,
    } = options;

    switch (strategy) {
      case 'localStorage':
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
          keys.forEach(k => localStorage.removeItem(k));
        }
        break;

      case 'sessionStorage':
        if (typeof window !== 'undefined') {
          const keys = Object.keys(sessionStorage).filter(k => k.startsWith(prefix));
          keys.forEach(k => sessionStorage.removeItem(k));
        }
        break;

      case 'memory':
      default:
        this.memoryCache.clear();
        break;
    }
  }

  /**
   * Vérifie si une clé existe dans le cache (et n'est pas expirée)
   */
  has(key: string, options: CacheOptions = {}): boolean {
    return this.get(key, options) !== null;
  }

  /**
   * Méthode wrapper pour gérer le cache avec une fonction de fallback
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Essayer d'abord de récupérer du cache
    const cached = this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Si pas en cache, exécuter la fonction fetcher
    const data = await fetcher();
    
    // Stocker dans le cache
    this.set(key, data, options);
    
    return data;
  }

  /**
   * Invalide le cache basé sur un pattern
   */
  invalidatePattern(pattern: string, options: CacheOptions = {}): void {
    const {
      strategy = 'memory',
      prefix = this.defaultPrefix,
    } = options;

    const regex = new RegExp(pattern);

    switch (strategy) {
      case 'localStorage':
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage).filter(k => 
            k.startsWith(prefix) && regex.test(k)
          );
          keys.forEach(k => localStorage.removeItem(k));
        }
        break;

      case 'sessionStorage':
        if (typeof window !== 'undefined') {
          const keys = Object.keys(sessionStorage).filter(k => 
            k.startsWith(prefix) && regex.test(k)
          );
          keys.forEach(k => sessionStorage.removeItem(k));
        }
        break;

      case 'memory':
      default:
        const keysToDelete: string[] = [];
        this.memoryCache.forEach((_, key) => {
          if (regex.test(key)) {
            keysToDelete.push(key);
          }
        });
        keysToDelete.forEach(k => this.memoryCache.delete(k));
        break;
    }
  }
}

// Instance singleton
export const cache = new CacheManager();

/**
 * Hook React pour utiliser le cache
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const result = await cache.getOrSet(key, fetcher, options);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { data, loading, error };
}

// Note: Pour React import
import React from 'react';
