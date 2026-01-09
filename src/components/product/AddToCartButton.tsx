'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
  attributeId?: number;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

export function AddToCartButton({ 
  productId, 
  quantity = 1, 
  attributeId,
  disabled = false,
  compact = false,
  className = ''
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      await addItem(productId, quantity, attributeId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Erreur ajout panier:', error);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        disabled={disabled || loading}
        className={`w-9 h-9 flex items-center justify-center rounded-lg bg-[#44D92C] hover:bg-[#3bc724] text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : added ? (
          <Check className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled || loading}
      className={`bg-[#44D92C] hover:bg-[#3bc724] text-black font-semibold transition-all duration-300 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : added ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {added ? 'Ajouté !' : 'Ajouter au panier'}
    </Button>
  );
}
