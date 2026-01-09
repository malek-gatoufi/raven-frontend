'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, BellOff, Loader2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockAlertButtonProps {
  productId: number;
  attributeId?: number;
  productName?: string;
  className?: string;
  variant?: 'button' | 'compact';
}

const API_BASE = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

export function StockAlertButton({ 
  productId, 
  attributeId = 0,
  productName,
  className,
  variant = 'button'
}: StockAlertButtonProps) {
  const { isAuthenticated, customer } = useAuth();
  const toast = useToast();
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  // Vérifier si déjà abonné
  useEffect(() => {
    checkSubscription();
  }, [productId, attributeId, isAuthenticated]);

  async function checkSubscription() {
    setIsChecking(true);
    try {
      let url = `${API_BASE}/index.php?fc=module&module=ravenapi&controller=stockalert&id_product=${productId}`;
      
      const response = await fetch(url, { credentials: 'include' });
      
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.subscribed || false);
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleSubscribe(userEmail?: string) {
    setIsLoading(true);
    
    try {
      const body: Record<string, unknown> = {
        id_product: productId,
        id_product_attribute: attributeId,
      };
      
      if (userEmail) {
        body.email = userEmail;
      }
      
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=stockalert`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setIsSubscribed(true);
        setShowEmailForm(false);
        toast.success(data.message || 'Alerte activée !');
      } else {
        toast.error(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      toast.error('Impossible de créer l\'alerte');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsubscribe() {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${API_BASE}/index.php?fc=module&module=ravenapi&controller=stockalert`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id_product: productId,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setIsSubscribed(false);
        toast.success('Alerte désactivée');
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      toast.error('Impossible de supprimer l\'alerte');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClick() {
    if (isSubscribed) {
      handleUnsubscribe();
    } else if (isAuthenticated) {
      handleSubscribe();
    } else {
      setShowEmailForm(true);
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      handleSubscribe(email);
    } else {
      toast.warning('Veuillez entrer un email valide');
    }
  }

  if (isChecking) {
    return (
      <Button variant="outline" disabled className={className}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (showEmailForm) {
    return (
      <form onSubmit={handleEmailSubmit} className={cn("space-y-2", className)}>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="bg-white/5 border-white/10"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#44D92C] hover:bg-[#3bc425] text-black shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setShowEmailForm(false)}
          className="text-xs text-gray-500 hover:text-gray-400"
        >
          Annuler
        </button>
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
          isSubscribed 
            ? "bg-[#44D92C]/10 text-[#44D92C] border border-[#44D92C]/30" 
            : "bg-white/5 text-gray-400 border border-white/10 hover:border-[#44D92C]/50 hover:text-[#44D92C]",
          className
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isSubscribed ? (
          <BellOff className="w-4 h-4" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
        {isSubscribed ? 'Alerte activée' : 'M\'alerter'}
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={isSubscribed ? "outline" : "default"}
      className={cn(
        isSubscribed 
          ? "border-[#44D92C] text-[#44D92C] hover:bg-[#44D92C]/10" 
          : "bg-amber-500 hover:bg-amber-600 text-black",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : isSubscribed ? (
        <BellOff className="w-4 h-4 mr-2" />
      ) : (
        <Bell className="w-4 h-4 mr-2" />
      )}
      {isSubscribed ? 'Alerte activée' : 'Me prévenir quand disponible'}
    </Button>
  );
}
