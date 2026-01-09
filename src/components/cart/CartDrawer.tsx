'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart();

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#0a0a0a] border-l border-white/10 p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-[#44D92C]/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-[#44D92C]" />
              </div>
              <div>
                <span className="font-semibold">Mon panier</span>
                {cart && cart.items.length > 0 && (
                  <p className="text-sm text-[#999] font-normal">
                    {cart.items.length} article{cart.items.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </SheetTitle>
            <button
              onClick={closeCart}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#999] hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
            <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-[#666]" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg">Votre panier est vide</p>
              <p className="text-sm text-[#999] mt-2">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
            </div>
            <Button
              asChild
              onClick={closeCart}
              className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
            >
              <Link href="/category/tous-les-produits">Voir les produits</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={`${item.id_product}-${item.id_product_attribute}`}
                    className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10"
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-[#333]" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id_product}-${item.link_rewrite || 'product'}`}
                        className="font-medium text-white hover:text-[#44D92C] line-clamp-2 transition-colors"
                        onClick={closeCart}
                      >
                        {item.name || `Produit #${item.id_product}`}
                      </Link>

                      {/* Price per unit */}
                      <p className="text-sm text-[#999] mt-1">
                        {formatPrice(item.price)} / unité
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10">
                          <button
                            className="h-8 w-8 flex items-center justify-center text-[#999] hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                            onClick={() =>
                              updateItem(
                                item.id_product,
                                item.quantity - 1,
                                item.id_product_attribute
                              )
                            }
                            disabled={item.quantity <= 1 || isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            className="h-8 w-8 flex items-center justify-center text-[#999] hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                            onClick={() =>
                              updateItem(
                                item.id_product,
                                item.quantity + 1,
                                item.id_product_attribute
                              )
                            }
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all disabled:opacity-50"
                          onClick={() => removeItem(item.id_product, item.id_product_attribute)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatPrice(item.total || item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer with totals */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] space-y-4">
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#999]">Sous-total</span>
                  <span className="text-white">{formatPrice(cart.total_products)}</span>
                </div>
                {cart.total_discounts > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#999]">Réductions</span>
                    <span className="text-[#44D92C]">-{formatPrice(cart.total_discounts)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#999]">Livraison</span>
                  <span className="text-white">
                    {cart.total_shipping > 0 ? formatPrice(cart.total_shipping) : (
                      <span className="text-[#44D92C]">Gratuite</span>
                    )}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-xl text-[#44D92C]">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold text-base glow-green-hover"
                  onClick={closeCart}
                >
                  <Link href="/checkout">Commander</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-11 border-white/20 text-white hover:bg-white/5 hover:border-[#44D92C]"
                  onClick={closeCart}
                >
                  <Link href="/cart">Voir le panier complet</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
