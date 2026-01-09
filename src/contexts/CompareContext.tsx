'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import type { Product } from '@/types/prestashop';

const MAX_COMPARE_ITEMS = 4;

interface CompareState {
  items: Product[];
  isOpen: boolean;
}

type CompareAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' };

const initialState: CompareState = {
  items: [],
  isOpen: false,
};

function compareReducer(state: CompareState, action: CompareAction): CompareState {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.length >= MAX_COMPARE_ITEMS) {
        return state;
      }
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload) 
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

interface CompareContextValue extends CompareState {
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: number) => void;
  isInCompare: (productId: number) => boolean;
  toggleCompare: (product: Product) => boolean;
  clearCompare: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  toggleCompareDrawer: () => void;
  canAddMore: boolean;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(compareReducer, initialState);
  
  let toast: ReturnType<typeof useToast> | null = null;
  try {
    toast = useToast();
  } catch {}

  const addToCompare = useCallback((product: Product): boolean => {
    if (state.items.length >= MAX_COMPARE_ITEMS) {
      toast?.warning(`Maximum ${MAX_COMPARE_ITEMS} produits dans le comparateur`);
      return false;
    }
    if (state.items.some(item => item.id === product.id)) {
      toast?.info('Produit déjà dans le comparateur');
      return false;
    }
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast?.success('Ajouté au comparateur');
    return true;
  }, [state.items, toast]);

  const removeFromCompare = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    toast?.success('Retiré du comparateur');
  }, [toast]);

  const isInCompare = useCallback((productId: number): boolean => {
    return state.items.some(item => item.id === productId);
  }, [state.items]);

  const toggleCompare = useCallback((product: Product): boolean => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return false;
    } else {
      return addToCompare(product);
    }
  }, [isInCompare, addToCompare, removeFromCompare]);

  const clearCompare = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    toast?.success('Comparateur vidé');
  }, [toast]);

  const openCompare = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeCompare = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const toggleCompareDrawer = useCallback(() => dispatch({ type: 'TOGGLE' }), []);

  const value: CompareContextValue = {
    ...state,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleCompare,
    clearCompare,
    openCompare,
    closeCompare,
    toggleCompareDrawer,
    canAddMore: state.items.length < MAX_COMPARE_ITEMS,
    count: state.items.length,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

export { MAX_COMPARE_ITEMS };
