'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  RotateCcw,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Package,
  FileText,
  ExternalLink,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from 'lucide-react';

interface OrderReturn {
  id: number;
  order_reference: string;
  return_number: string;
  state: number;
  state_name: string;
  date_add: string;
  details_url: string;
  return_url: string;
  print_url?: string;
  products: Array<{
    name: string;
    quantity: number;
    reason: string;
  }>;
}

export default function ReturnsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [returns, setReturns] = useState<OrderReturn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connexion?redirect=/compte/retours');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadReturns();
    }
  }, [isAuthenticated]);

  async function loadReturns() {
    setIsLoading(true);
    try {
      const { customerApi } = await import('@/lib/api');
      const data = await customerApi.getReturns();
      setReturns(data);
    } catch (err) {
      console.error('Failed to load returns:', err);
      setError('Impossible de charger vos retours');
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

  const getStatusIcon = (state: number) => {
    switch (state) {
      case 1: // En attente de colis
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 2: // Colis reçu
        return <Package className="w-5 h-5 text-blue-500" />;
      case 3: // Retour complet
        return <CheckCircle className="w-5 h-5 text-[#44D92C]" />;
      case 4: // Retour refusé
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 5: // En attente d'expédition
        return <Truck className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (state: number) => {
    switch (state) {
      case 1: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 2: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 3: return 'bg-[#44D92C]/10 text-[#44D92C] border-[#44D92C]/20';
      case 4: return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 5: return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
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
            <h1 className="text-2xl font-bold">Mes retours produits</h1>
            <p className="text-gray-400">Suivez l'état de vos demandes de retour</p>
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
        ) : returns.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#44D92C]/10 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-[#44D92C]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucun retour en cours</h3>
              <p className="text-gray-400 mb-6">
                Vous n'avez pas de demande de retour en cours.
              </p>
              <Link href="/compte?tab=orders">
                <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black">
                  <Package className="w-4 h-4 mr-2" />
                  Voir mes commandes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {returns.map((ret) => (
              <Card key={ret.id} className="bg-[#1a1a1a] border-white/10 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left side: Return info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(ret.state)}
                        <div>
                          <span className="text-gray-400 text-sm">Retour n°</span>
                          <span className="font-semibold ml-1">{ret.return_number}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ret.state)}`}>
                          {ret.state_name}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-500 text-sm">Commande associée</span>
                          <p className="font-medium">{ret.order_reference}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Date de demande</span>
                          <p className="font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {formatDate(ret.date_add)}
                          </p>
                        </div>
                      </div>

                      {/* Products in return */}
                      {ret.products && ret.products.length > 0 && (
                        <div className="bg-[#0a0a0a] rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Produits concernés</h4>
                          <ul className="space-y-2">
                            {ret.products.map((product, idx) => (
                              <li key={idx} className="flex items-center justify-between text-sm">
                                <span>{product.name}</span>
                                <span className="text-gray-500">x{product.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex flex-col gap-2 lg:items-end">
                      <Link href={`/compte/commandes/${ret.order_reference}`}>
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-[#44D92C]/50">
                          <Package className="w-4 h-4 mr-2" />
                          Voir la commande
                        </Button>
                      </Link>
                      
                      {ret.print_url && (
                        <a href={ret.print_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-[#44D92C]/50">
                            <FileText className="w-4 h-4 mr-2" />
                            Bon de retour
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info section */}
        <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#44D92C]" />
            Comment effectuer un retour ?
          </h4>
          <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
            <li>Accédez à votre commande dans l'historique</li>
            <li>Sélectionnez les produits à retourner</li>
            <li>Imprimez le bon de retour</li>
            <li>Envoyez le colis à l'adresse indiquée</li>
            <li>Suivez l'état de votre retour sur cette page</li>
          </ol>
        </div>

        {/* Retour policy link */}
        <div className="mt-4 text-center">
          <Link 
            href="/retours" 
            className="text-gray-400 hover:text-[#44D92C] transition-colors text-sm inline-flex items-center gap-1"
          >
            Consulter notre politique de retour
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
