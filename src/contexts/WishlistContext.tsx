'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/toast';
import type { Product } from '@/types/prestashop';

interface WishlistItem {
  id_wishlist: number;
  id_product: number;
  id_product_attribute: number;
  name: string;
  reference: string;
  link_rewrite: string;
  price: number;
  price_without_reduction: number;
  on_sale: boolean;
  reduction: number;
  quantity: number;
  available: boolean;
  image: string | null;
  manufacturer: string | null;
  category: string | null;
  url: string;
  date_added: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  count: number;
}

type WishlistAction =
  | { type: 'SET_ITEMS'; payload: WishlistItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_COUNT'; payload: number }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR' };

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  count: 0,
};

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, count: action.payload.length, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_COUNT':
      return { ...state, count: action.payload };
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: [action.payload, ...state.items], 
        count: state.count + 1 
      };
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter(item => item.id_product !== action.payload),
        count: Math.max(0, state.count - 1)
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

interface WishlistContextValue extends WishlistState {
  addToWishlist: (productId: number, attributeId?: number) => Promise<boolean>;
  removeFromWishlist: (productId: number, attributeId?: number) => Promise<boolean>;
  isInWishlist: (productId: number, attributeId?: number) => boolean;
  toggleWishlist: (productId: number, attributeId?: number) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isAuthenticated } = useAuth();
  
  let toast: ReturnType<typeof useToast> | null = null;
  try {
    toast = useToast();
  } catch {}

  // Charger la wishlist quand l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      dispatch({ type: 'CLEAR' });
    }
  }, [isAuthenticated]);

  async function loadWishlist() {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=wishlist`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'SET_ITEMS', payload: data.wishlist || [] });
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  const addToWishlist = useCallback(async (productId: number, attributeId: number = 0): Promise<boolean> => {
    if (!isAuthenticated) {
      toast?.warning('Connectez-vous pour ajouter aux favoris');
      return false;
    }

    try {
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=wishlist`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id_product: productId,
            id_product_attribute: attributeId,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        if (data.already_exists) {
          toast?.info('Produit déjà dans vos favoris');
        } else {
          toast?.success('Ajouté aux favoris ❤️');
          dispatch({ type: 'SET_COUNT', payload: data.count });
          // Rafraîchir la liste complète
          loadWishlist();
        }
        return true;
      } else {
        toast?.error(data.error || 'Erreur lors de l\'ajout');
        return false;
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast?.error('Impossible d\'ajouter aux favoris');
      return false;
    }
  }, [isAuthenticated, toast]);

  const removeFromWishlist = useCallback(async (productId: number, attributeId: number = 0): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=wishlist`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id_product: productId,
            id_product_attribute: attributeId,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast?.success('Retiré des favoris');
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
        return true;
      } else {
        toast?.error(data.error || 'Erreur lors de la suppression');
        return false;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast?.error('Impossible de retirer des favoris');
      return false;
    }
  }, [toast]);

  const isInWishlist = useCallback((productId: number, attributeId: number = 0): boolean => {
    return state.items.some(
      item => item.id_product === productId && 
              (attributeId === 0 || item.id_product_attribute === attributeId)
    );
  }, [state.items]);

  const toggleWishlist = useCallback(async (productId: number, attributeId: number = 0): Promise<boolean> => {
    if (isInWishlist(productId, attributeId)) {
      return removeFromWishlist(productId, attributeId);
    } else {
      return addToWishlist(productId, attributeId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const refreshWishlist = useCallback(async () => {
    if (isAuthenticated) {
      await loadWishlist();
    }
  }, [isAuthenticated]);

  const value: WishlistContextValue = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export type { WishlistItem };
