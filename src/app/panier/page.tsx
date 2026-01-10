'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CartSkeleton } from '@/components/ui/skeleton';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft,
  Tag,
  Truck,
  Shield,
  AlertCircle,
  Package
} from 'lucide-react';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, applyPromoCode } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    setPromoError(null);
    
    try {
      await applyPromoCode(promoCode);
      setPromoCode('');
    } catch {
      setPromoError('Code promo invalide ou expiré');
    } finally {
      setPromoLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartSkeleton />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-gray-400 mb-8">
            Parcourez notre catalogue pour trouver les pièces qu&apos;il vous faut !
          </p>
          <Link href="/category/2-accueil">
            <Button className="h-12 px-8 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold">
              <Package className="mr-2 w-5 h-5" />
              Parcourir les produits
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-[#44D92C] to-[#2da31e] rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mon Panier</h1>
          <p className="text-gray-400">{cart.items.length} article{cart.items.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={`${item.id_product}-${item.id_product_attribute}`} className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name || 'Produit'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Détails */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link 
                          href={`/product/${item.id_product}-${item.link_rewrite || 'produit'}`}
                          className="font-semibold text-lg hover:text-[#44D92C] transition-colors line-clamp-2"
                        >
                          {item.name || `Produit #${item.id_product}`}
                        </Link>
                        {item.reference && (
                          <p className="text-sm text-gray-500 mt-1">Réf: {item.reference}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id_product, item.id_product_attribute)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantité */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id_product, item.quantity - 1, item.id_product_attribute)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id_product, item.quantity + 1, item.id_product_attribute)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Prix */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#44D92C]">
                          {formatPrice(item.total || item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} / unité
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Continuer les achats */}
          <Link href="/category/2-accueil" className="inline-flex items-center text-gray-400 hover:text-[#44D92C] transition-colors mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuer mes achats
          </Link>
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Code promo */}
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#44D92C]" />
                  Code promo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Entrez votre code"
                    className="bg-white/5 border-white/10 focus:border-[#44D92C] uppercase"
                  />
                  <Button 
                    onClick={handleApplyPromo}
                    variant="outline"
                    className="border-[#44D92C] text-[#44D92C] hover:bg-[#44D92C] hover:text-black"
                    disabled={promoLoading}
                  >
                    {promoLoading ? '...' : 'OK'}
                  </Button>
                </div>
                {promoError && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {promoError}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Récapitulatif */}
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total</span>
                  <span>{formatPrice(cart.total_products)}</span>
                </div>
                
                {cart.total_discounts > 0 && (
                  <div className="flex justify-between text-[#44D92C]">
                    <span>Réductions</span>
                    <span>-{formatPrice(cart.total_discounts)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Livraison</span>
                  <span>{cart.total_shipping > 0 ? formatPrice(cart.total_shipping) : 'Calculée à l\'étape suivante'}</span>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#44D92C]">{formatPrice(cart.total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold text-lg">
                    Commander
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Avantages */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Truck className="w-6 h-6 text-[#44D92C] mx-auto mb-2" />
                <p className="text-xs text-gray-400">Livraison rapide</p>
                <p className="text-xs font-semibold">24-48h</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Shield className="w-6 h-6 text-[#44D92C] mx-auto mb-2" />
                <p className="text-xs text-gray-400">Paiement</p>
                <p className="text-xs font-semibold">100% Sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
