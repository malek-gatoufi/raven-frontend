'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Loader2, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductActionsProps {
  product: {
    id: number;
    name: string;
    quantity: number;
    available_for_order: boolean;
    combinations?: Array<{
      id: number;
      reference: string;
      price: number;
      quantity: number;
      attributes: Array<{
        id: number;
        id_attribute_group: number;
        group_name: string;
        name: string;
        color?: string;
      }>;
    }>;
  };
  disabled?: boolean;
}

export function ProductActions({ product, disabled = false }: ProductActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedCombination, setSelectedCombination] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  // Group combinations by attribute group
  const attributeGroups = product.combinations?.reduce((acc, combo) => {
    combo.attributes.forEach(attr => {
      if (!acc[attr.id_attribute_group]) {
        acc[attr.id_attribute_group] = {
          name: attr.group_name,
          values: new Map()
        };
      }
      acc[attr.id_attribute_group].values.set(attr.id, {
        name: attr.name,
        color: attr.color
      });
    });
    return acc;
  }, {} as Record<number, { name: string; values: Map<number, { name: string; color?: string }> }>);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const increaseQuantity = () => {
    const maxQty = product.quantity;
    if (quantity < maxQty) setQuantity(q => q + 1);
  };

  const handleAddToCart = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      await addItem(product.id, quantity, selectedCombination);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (error) {
      console.error('Erreur ajout panier:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist API
    setWishlistAdded(!wishlistAdded);
  };

  return (
    <div className="space-y-6">
      {/* Combinations / Variants */}
      {attributeGroups && Object.keys(attributeGroups).length > 0 && (
        <div className="space-y-4">
          {Object.entries(attributeGroups).map(([groupId, group]) => (
            <div key={groupId}>
              <label className="text-sm font-medium text-gray-300 mb-2 block">{group.name}</label>
              <div className="flex flex-wrap gap-2">
                {Array.from(group.values.entries()).map(([attrId, attr]) => (
                  <button
                    key={attrId}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedCombination === attrId
                        ? 'border-[#44D92C] bg-[#44D92C]/10 text-[#44D92C]'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    style={attr.color ? { 
                      backgroundColor: attr.color,
                      borderColor: selectedCombination === attrId ? '#44D92C' : attr.color
                    } : undefined}
                    onClick={() => setSelectedCombination(attrId)}
                  >
                    {!attr.color && attr.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity selector */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Quantité</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-16 h-12 flex items-center justify-center font-semibold text-lg border-x border-white/20">
              {quantity}
            </div>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= product.quantity}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {product.quantity <= 10 && product.quantity > 0 && (
            <span className="text-sm text-orange-400">{product.quantity} disponible{product.quantity > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={disabled || loading}
          size="lg"
          className="flex-1 h-14 bg-[#44D92C] hover:bg-[#3bc724] text-black font-bold text-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : added ? (
            <Check className="w-5 h-5 mr-2" />
          ) : (
            <ShoppingCart className="w-5 h-5 mr-2" />
          )}
          {added ? 'Ajouté au panier !' : 'Ajouter au panier'}
        </Button>

        <Button
          onClick={handleAddToWishlist}
          variant="outline"
          size="lg"
          className={`h-14 w-14 border-white/20 transition-all ${wishlistAdded ? 'bg-red-500/10 border-red-500 text-red-500' : 'hover:border-red-500 hover:text-red-500'}`}
        >
          <Heart className={`w-5 h-5 ${wishlistAdded ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {disabled && (
        <p className="text-red-400 text-sm text-center">Ce produit n&apos;est pas disponible à la vente</p>
      )}
    </div>
  );
}
