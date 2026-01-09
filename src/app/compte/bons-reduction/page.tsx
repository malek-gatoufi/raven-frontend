'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Ticket,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Percent,
  Euro,
  ShoppingCart,
  Copy,
  Check,
  Gift,
  Loader2,
} from 'lucide-react';

interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  value: string;
  quantity: number;
  minimum: string;
  cumulative: boolean;
  expiration_date: string;
  is_expired: boolean;
}

export default function VouchersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connexion?redirect=/compte/bons-reduction');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadVouchers();
    }
  }, [isAuthenticated]);

  async function loadVouchers() {
    setIsLoading(true);
    try {
      const { customerApi } = await import('@/lib/api');
      const data = await customerApi.getVouchers();
      setVouchers(data);
    } catch (err) {
      console.error('Failed to load vouchers:', err);
      setError('Impossible de charger vos bons de réduction');
    } finally {
      setIsLoading(false);
    }
  }

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/compte">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Mes bons de réduction</h1>
            <p className="text-gray-400">Gérez vos codes promo et bons d'achat</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
          </div>
        ) : vouchers.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#44D92C]/10 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-[#44D92C]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucun bon de réduction</h3>
              <p className="text-gray-400 mb-6">
                Vous n'avez pas encore de bons de réduction actifs.
              </p>
              <Link href="/">
                <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Découvrir nos offres
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {vouchers.map((voucher) => (
              <Card 
                key={voucher.id} 
                className={`bg-[#1a1a1a] border-white/10 overflow-hidden ${
                  voucher.is_expired ? 'opacity-60' : ''
                }`}
              >
                <div className="flex">
                  {/* Left colored strip */}
                  <div className={`w-2 ${voucher.is_expired ? 'bg-gray-600' : 'bg-[#44D92C]'}`} />
                  
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className={`w-5 h-5 ${voucher.is_expired ? 'text-gray-500' : 'text-[#44D92C]'}`} />
                          <h3 className="font-semibold text-lg">{voucher.name}</h3>
                          {voucher.is_expired && (
                            <span className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded-full">
                              Expiré
                            </span>
                          )}
                        </div>
                        
                        {voucher.description && (
                          <p className="text-gray-400 text-sm mb-3">{voucher.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-400">
                            {voucher.value.includes('%') ? (
                              <Percent className="w-4 h-4" />
                            ) : (
                              <Euro className="w-4 h-4" />
                            )}
                            <span className="font-medium text-white">{voucher.value}</span>
                          </div>
                          
                          {voucher.minimum !== '0' && voucher.minimum !== '0,00 €' && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <ShoppingCart className="w-4 h-4" />
                              <span>Min. {voucher.minimum}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {voucher.is_expired 
                                ? `Expiré le ${formatDate(voucher.expiration_date)}`
                                : `Expire le ${formatDate(voucher.expiration_date)}`
                              }
                            </span>
                          </div>
                          
                          {voucher.quantity > 1 && (
                            <div className="text-gray-400">
                              <span>{voucher.quantity}x utilisable{voucher.quantity > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Code + Copy button */}
                      {!voucher.is_expired && (
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-[#0a0a0a] rounded-lg border border-dashed border-[#44D92C]/30">
                            <code className="font-mono text-[#44D92C] font-semibold">
                              {voucher.code}
                            </code>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyCode(voucher.code)}
                            className="text-gray-400 hover:text-[#44D92C]"
                          >
                            {copiedCode === voucher.code ? (
                              <Check className="w-5 h-5 text-[#44D92C]" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info section */}
        <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#44D92C]" />
            Comment utiliser vos bons ?
          </h4>
          <p className="text-gray-400 text-sm">
            Entrez le code de votre bon dans le champ "Code promo" lors de votre commande. 
            Le montant sera automatiquement déduit de votre panier si les conditions sont remplies.
          </p>
        </div>
      </div>
    </div>
  );
}
