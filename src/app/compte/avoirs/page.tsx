'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Receipt,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  Euro,
} from 'lucide-react';

interface CreditSlip {
  id: number;
  reference: string;
  order_reference: string;
  amount: number;
  date_add: string;
  pdf_url?: string;
}

export default function CreditSlipsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [creditSlips, setCreditSlips] = useState<CreditSlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connexion?redirect=/compte/avoirs');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCreditSlips();
    }
  }, [isAuthenticated]);

  async function loadCreditSlips() {
    setIsLoading(true);
    try {
      const { customerApi } = await import('@/lib/api');
      const data = await customerApi.getCreditSlips();
      setCreditSlips(data);
    } catch (err) {
      console.error('Failed to load credit slips:', err);
      setError('Impossible de charger vos avoirs');
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
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
            <h1 className="text-2xl font-bold">Mes avoirs</h1>
            <p className="text-gray-400">Consultez vos avoirs et téléchargez vos documents</p>
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
        ) : creditSlips.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#44D92C]/10 flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-[#44D92C]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucun avoir</h3>
              <p className="text-gray-400 mb-6">
                Vous n'avez pas encore d'avoirs sur votre compte.
              </p>
              <Link href="/compte?tab=orders">
                <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black">
                  Voir mes commandes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Card className="bg-[#1a1a1a] border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Référence</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Commande</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Montant</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Document</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {creditSlips.map((slip) => (
                        <tr key={slip.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{slip.reference}</td>
                          <td className="px-6 py-4">
                            <Link 
                              href={`/compte/commandes/${slip.order_reference}`}
                              className="text-[#44D92C] hover:underline"
                            >
                              {slip.order_reference}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{formatDate(slip.date_add)}</td>
                          <td className="px-6 py-4 text-right font-semibold text-[#44D92C]">
                            {formatPrice(slip.amount)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {slip.pdf_url ? (
                              <a href={slip.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#44D92C]">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </a>
                            ) : (
                              <span className="text-gray-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {creditSlips.map((slip) => (
                <Card key={slip.id} className="bg-[#1a1a1a] border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#44D92C]" />
                        <span className="font-semibold">{slip.reference}</span>
                      </div>
                      <span className="font-bold text-[#44D92C]">{formatPrice(slip.amount)}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Commande</span>
                        <Link 
                          href={`/compte/commandes/${slip.order_reference}`}
                          className="text-[#44D92C] hover:underline"
                        >
                          {slip.order_reference}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          {formatDate(slip.date_add)}
                        </span>
                      </div>
                    </div>

                    {slip.pdf_url && (
                      <a href={slip.pdf_url} target="_blank" rel="noopener noreferrer" className="block mt-4">
                        <Button variant="outline" size="sm" className="w-full border-white/10 hover:border-[#44D92C]/50">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger le PDF
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Info section */}
        <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Euro className="w-4 h-4 text-[#44D92C]" />
            Qu'est-ce qu'un avoir ?
          </h4>
          <p className="text-gray-400 text-sm">
            Un avoir est un document comptable correspondant à un remboursement partiel ou total d'une commande.
            Il peut être utilisé lors de vos prochaines commandes ou faire l'objet d'un remboursement.
          </p>
        </div>
      </div>
    </div>
  );
}
