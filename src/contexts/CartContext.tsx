'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { cartApi } from '@/lib/api';
import { useToast } from '@/components/ui/toast';
import type { Cart, CartItem } from '@/types/prestashop';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const initialState: CartState = {
  cart: null,
  isLoading: true,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (productId: number, quantity?: number, attributeId?: number) => Promise<void>;
  updateItem: (productId: number, quantity: number, attributeId?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number, attributeId?: number) => Promise<void>;
  removeItem: (productId: number, attributeId?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: (code: string) => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Toast est optionnel - peut ne pas être disponible pendant SSR
  let toast: ReturnType<typeof useToast> | null = null;
  try {
    toast = useToast();
  } catch {}

  // Charger le panier au démarrage
  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const cart = await cartApi.get();
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Failed to load cart:', error);
      dispatch({ type: 'SET_CART', payload: null });
    }
  }

  async function addItem(productId: number, quantity = 1, attributeId?: number) {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartApi.addItem(productId, quantity, attributeId);
      dispatch({ type: 'SET_CART', payload: cart });
      dispatch({ type: 'OPEN_CART' });
      toast?.success('Produit ajouté au panier');
    } catch (error) {
      console.error('Failed to add item:', error);
      toast?.error('Impossible d\'ajouter le produit au panier');
      throw error;
    }
  }

  async function updateItem(productId: number, quantity: number, attributeId?: number) {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartApi.updateItem(productId, quantity, attributeId);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  }

  async function removeItem(productId: number, attributeId?: number) {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartApi.removeItem(productId, attributeId);
      dispatch({ type: 'SET_CART', payload: cart });
      toast?.success('Produit retiré du panier');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast?.error('Impossible de retirer le produit');
      throw error;
    }
  }

  async function clearCart() {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartApi.clear();
      dispatch({ type: 'SET_CART', payload: null });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }

  async function applyPromoCode(code: string) {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartApi.applyPromoCode(code);
      dispatch({ type: 'SET_CART', payload: cart });
      toast?.success('Code promo appliqué');
    } catch (error) {
      console.error('Failed to apply promo code:', error);
      toast?.error('Code promo invalide ou expiré');
      throw error;
    }
  }

  async function removePromoCode(code: string) {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartApi.removePromoCode(code);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Failed to remove promo code:', error);
      throw error;
    }
  }

  const itemCount = state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const value: CartContextValue = {
    ...state,
    addItem,
    updateItem,
    updateQuantity: updateItem,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
