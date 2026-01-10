'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types/prestashop';

interface RelatedProductsProps {
  currentProduct: Product;
  categoryId?: number;
}

export function RelatedProducts({ currentProduct, categoryId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const params = new URLSearchParams({
          limit: '4',
          exclude: currentProduct.id.toString(),
        });

        if (categoryId) {
          params.set('category', categoryId.toString());
        }

        const response = await fetch(`/api/prestashop?endpoint=products&${params}`);
        const data = await response.json();
        setProducts(data.data?.slice(0, 4) || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelated();
  }, [currentProduct.id, categoryId]);

  if (isLoading) {
    return (
      <section className="py-12 border-t border-white/10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Produits complémentaires
          </h2>
          <p className="text-gray-400">
            Souvent achetés ensemble
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 border-t border-white/10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          🛒 Produits complémentaires
        </h2>
        <p className="text-gray-400">
          Les clients qui ont acheté ce produit ont également acheté
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
