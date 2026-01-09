'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/prestashop';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading } = useCart();

  const hasReduction = product.reduction > 0;
  const isOutOfStock = product.quantity <= 0;

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function incrementQuantity() {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  }

  async function handleAddToCart() {
    await addItem(product.id, quantity);
  }

  return (
    <div className="space-y-6">
      {/* Manufacturer */}
      {product.manufacturer_name && (
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          {product.manufacturer_name}
        </p>
      )}

      {/* Name */}
      <h1 className="text-3xl font-bold">{product.name}</h1>

      {/* Reference & Category */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {product.reference && (
          <span>Réf: {product.reference}</span>
        )}
        {product.reference && product.category_name && (
          <span>•</span>
        )}
        {product.category_name && (
          <span>Catégorie: {product.category_name}</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className={`text-4xl font-bold ${hasReduction ? 'text-red-600' : ''}`}>
          {formatPrice(product.price)}
        </span>
        {hasReduction && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(product.price_without_reduction)}
            </span>
            <Badge variant="destructive" className="text-sm">
              -{product.reduction_type === 'percentage' 
                ? `${product.reduction}%` 
                : formatPrice(product.reduction)}
            </Badge>
          </>
        )}
      </div>

      {/* Tax info */}
      <p className="text-sm text-muted-foreground">
        TTC • Livraison calculée à l'étape suivante
      </p>

      <Separator />

      {/* Short description */}
      {product.description_short && (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description_short }}
        />
      )}

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <Badge variant="destructive">Rupture de stock</Badge>
        ) : product.quantity <= 5 ? (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            Plus que {product.quantity} en stock
          </Badge>
        ) : (
          <Badge variant="outline" className="border-green-600 text-green-600">
            En stock
          </Badge>
        )}
      </div>

      <Separator />

      {/* Quantity selector & Add to cart */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Quantity */}
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isOutOfStock}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= product.quantity || isOutOfStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to cart button */}
        <Button
          className="flex-1"
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
        </Button>

        {/* Wishlist */}
        <Button variant="outline" size="lg">
          <Heart className="h-5 w-5" />
        </Button>

        {/* Share */}
        <Button variant="outline" size="lg">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <Separator />

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Livraison rapide</p>
            <p className="text-xs text-muted-foreground">2-5 jours ouvrés</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Retours gratuits</p>
            <p className="text-xs text-muted-foreground">Sous 30 jours</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Paiement sécurisé</p>
            <p className="text-xs text-muted-foreground">SSL crypté</p>
          </div>
        </div>
      </div>
    </div>
  );
}
