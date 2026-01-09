'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { customerApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order } from '@/types/prestashop';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  Check,
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
} from 'lucide-react';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reference = params.reference as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connexion?redirect=/compte');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && reference) {
      loadOrder();
    }
  }, [isAuthenticated, reference]);

  async function loadOrder() {
    setIsLoading(true);
    try {
      const orderData = await customerApi.getOrder(reference);
      setOrder(orderData);
    } catch (err) {
      console.error('Failed to load order:', err);
      setError('Commande introuvable');
    } finally {
      setIsLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderStatusIcon = (state: number) => {
    switch (state) {
      case 1: return <Clock className="w-5 h-5 text-yellow-500" />;
      case 2: return <Check className="w-5 h-5 text-green-500" />;
      case 3: return <Package className="w-5 h-5 text-blue-500" />;
      case 4: return <Truck className="w-5 h-5 text-purple-500" />;
      case 5: return <CheckCircle className="w-5 h-5 text-[#44D92C]" />;
      case 6: return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (state: number) => {
    switch (state) {
      case 1: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 2: return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 3: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 4: return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 5: return 'bg-[#44D92C]/10 text-[#44D92C] border-[#44D92C]/20';
      case 6: return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#44D92C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">{error || 'Commande introuvable'}</h1>
          <Link href="/compte?tab=orders">
            <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux commandes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/compte?tab=orders" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Commande {order.reference}</h1>
            <p className="text-gray-400">Passée le {formatDate(order.date_add)}</p>
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.current_state)}`}>
          {getOrderStatusIcon(order.current_state)}
          <span className="font-semibold">{order.state_name}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Articles */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1a1a1a]/80 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#44D92C]" />
                Articles commandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="relative w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{item.product_name}</p>
                      {item.product_reference && (
                        <p className="text-sm text-gray-500">Réf: {item.product_reference}</p>
                      )}
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400">Qté: {item.product_quantity}</span>
                        <span className="font-bold text-[#44D92C]">{formatPrice(item.total_price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historique */}
          {order.history && order.history.length > 0 && (
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#44D92C]" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.history.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-3 h-3 mt-1.5 rounded-full bg-[#44D92C]"></div>
                      <div>
                        <p className="font-medium">{item.state_name}</p>
                        <p className="text-sm text-gray-400">{formatDate(item.date_add)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Récapitulatif */}
          <Card className="bg-[#1a1a1a]/80 border-white/10">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span>{formatPrice(order.total_products)}</span>
              </div>
              {(order.total_discounts ?? 0) > 0 && (
                <div className="flex justify-between text-[#44D92C]">
                  <span>Réductions</span>
                  <span>-{formatPrice(order.total_discounts!)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span>{order.total_shipping > 0 ? formatPrice(order.total_shipping) : 'Offert'}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#44D92C]">{formatPrice(order.total_paid)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse de livraison */}
          {order.address_delivery && (
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4 text-[#44D92C]" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-400">
                <p className="font-medium text-white">{order.address_delivery.firstname} {order.address_delivery.lastname}</p>
                <p>{order.address_delivery.address1}</p>
                {order.address_delivery.address2 && <p>{order.address_delivery.address2}</p>}
                <p>{order.address_delivery.postcode} {order.address_delivery.city}</p>
                <p>{order.address_delivery.country}</p>
              </CardContent>
            </Card>
          )}

          {/* Mode de paiement */}
          <Card className="bg-[#1a1a1a]/80 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="w-4 h-4 text-[#44D92C]" />
                Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{order.payment}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          {order.invoice_url && (
            <a href={order.invoice_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-white/10 hover:border-[#44D92C]">
                <Download className="w-4 h-4 mr-2" />
                Télécharger la facture
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
