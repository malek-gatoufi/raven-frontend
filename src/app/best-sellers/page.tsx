'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from '@/components/product/AddToCartButton';

interface Product {
  id: number;
  name: string;
  price: number;
  cover_image: string | null;
  link_rewrite: string;
  reference: string;
  quantity: number;
}

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=20&sort=sales');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Erreur chargement produits:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <TrendingUp className="h-16 w-16 text-[#44D92C] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Meilleures ventes</h1>
          <p className="text-[#999] text-lg">
            Les produits les plus populaires auprès de nos clients
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-[#1a1a1a] border-white/10 animate-pulse">
                <div className="aspect-square bg-white/5" />
                <CardContent className="p-4">
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-6 bg-white/10 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden group hover:border-[#44D92C]/50 transition-all duration-300"
              >
                <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                  <div className="relative aspect-square bg-white/5 overflow-hidden">
                    {/* Badge position */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500 text-black">
                        #{index + 1}
                      </span>
                    </div>
                    
                    {product.cover_image ? (
                      <Image
                        src={product.cover_image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-[#333]" />
                      </div>
                    )}
                  </div>
                </Link>
                
                <CardContent className="p-4">
                  <Link href={`/product/${product.id}-${product.link_rewrite}`}>
                    <h3 className="font-medium text-sm line-clamp-2 min-h-[40px] hover:text-[#44D92C] transition-colors text-white">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{product.reference}</p>
                  
                  <div className="flex items-end justify-between mt-3 gap-2">
                    <p className="text-lg font-bold text-[#44D92C]">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                    </p>
                    <AddToCartButton 
                      productId={product.id} 
                      disabled={product.quantity <= 0}
                      compact 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-[#333] mx-auto mb-4" />
            <p className="text-[#999]">Aucun produit disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
