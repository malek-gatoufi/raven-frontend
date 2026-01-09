'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/toast';
import type { Customer } from '@/types/prestashop';

interface AuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    newsletter?: boolean;
  }) => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Toast est optionnel - peut ne pas être disponible pendant SSR
  let toast: ReturnType<typeof useToast> | null = null;
  try {
    toast = useToast();
  } catch {}

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const user = await authApi.getMe();
      setCustomer(user);
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const user = await authApi.login(email, password);
      setCustomer(user);
      toast?.success(`Bienvenue ${user.firstname} !`);
    } catch (error) {
      toast?.error('Email ou mot de passe incorrect');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    try {
      await authApi.logout();
      setCustomer(null);
      toast?.success('Déconnexion réussie');
    } catch (error) {
      toast?.error('Erreur lors de la déconnexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    newsletter?: boolean;
  }) {
    setIsLoading(true);
    try {
      const user = await authApi.register(data);
      setCustomer(user);
      toast?.success(`Bienvenue ${user.firstname} ! Votre compte a été créé.`);
    } catch (error) {
      toast?.error('Impossible de créer le compte');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const value: AuthContextValue = {
    customer,
    isLoading,
    isAuthenticated: !!customer,
    login,
    logout,
    register,
    refreshCustomer: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
