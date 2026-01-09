'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist, WishlistItem } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Package, 
  ArrowRight,
  Loader2,
  HeartOff
} from 'lucide-react';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

function WishlistItemCard({ item, onRemove, onAddToCart }: { 
  item: WishlistItem; 
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart();
    setIsAddingToCart(false);
  };

  return (
    <Card className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden group hover:border-[#44D92C]/30 transition-all">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link 
          href={`/product/${item.id_product}-${item.link_rewrite}`}
          className="relative w-full sm:w-48 h-48 sm:h-auto bg-white/5 shrink-0"
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-600" />
            </div>
          )}
          {item.on_sale && item.reduction > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round(item.reduction * 100)}%
            </span>
          )}
        </Link>

        {/* Content */}
        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <Link href={`/product/${item.id_product}-${item.link_rewrite}`}>
              <h3 className="font-medium text-lg hover:text-[#44D92C] transition-colors line-clamp-2">
                {item.name}
              </h3>
            </Link>
            
            {item.reference && (
              <p className="text-sm text-gray-500 font-mono mt-1">{item.reference}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              {item.manufacturer && <span>{item.manufacturer}</span>}
              {item.manufacturer && item.category && <span>•</span>}
              {item.category && <span>{item.category}</span>}
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
            {/* Prix */}
            <div>
              <p className="text-2xl font-bold text-[#44D92C]">{formatPrice(item.price)}</p>
              {item.on_sale && item.price_without_reduction > item.price && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(item.price_without_reduction)}
                </p>
              )}
              <p className={`text-sm mt-1 ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                {item.available ? `En stock (${item.quantity})` : 'Rupture de stock'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRemove}
                disabled={isRemoving}
                className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10"
                title="Retirer des favoris"
              >
                {isRemoving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-400" />
                )}
              </Button>
              
              <Button
                onClick={handleAddToCart}
                disabled={!item.available || isAddingToCart}
                className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                Ajouter au panier
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function WishlistPage() {
  const { items, isLoading, removeFromWishlist, count } = useWishlist();
  const { addItem } = useCart();

  const handleRemove = async (productId: number, attributeId: number) => {
    await removeFromWishlist(productId, attributeId);
  };

  const handleAddToCart = async (productId: number, attributeId: number) => {
    await addItem(productId, 1, attributeId || undefined);
  };

  const handleAddAllToCart = async () => {
    const availableItems = items.filter(item => item.available);
    for (const item of availableItems) {
      await addItem(item.id_product, 1, item.id_product_attribute || undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
            <span className="ml-3 text-gray-400">Chargement de vos favoris...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/10">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mes Favoris</h1>
              <p className="text-gray-400">
                {count} {count > 1 ? 'produits' : 'produit'} sauvegardé{count > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <Button
              onClick={handleAddAllToCart}
              className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Tout ajouter au panier
            </Button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <Card className="bg-[#1a1a1a]/50 border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HeartOff className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Vous n'avez pas encore ajouté de produits à vos favoris. 
                Parcourez notre catalogue et cliquez sur le ❤️ pour sauvegarder vos produits préférés.
              </p>
              <Link href="/recherche">
                <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold">
                  Explorer le catalogue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <WishlistItemCard
                key={`${item.id_product}-${item.id_product_attribute}`}
                item={item}
                onRemove={() => handleRemove(item.id_product, item.id_product_attribute)}
                onAddToCart={() => handleAddToCart(item.id_product, item.id_product_attribute)}
              />
            ))}
          </div>
        )}

        {/* Suggestions - à implémenter */}
        {items.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Vous pourriez aussi aimer</h2>
            <p className="text-gray-400">
              <Link href="/recherche" className="text-[#44D92C] hover:underline">
                Découvrir plus de produits →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
