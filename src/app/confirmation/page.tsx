'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight, Home, Printer } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderReference = searchParams.get('order');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Animation confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: i % 3 === 0 ? '#44D92C' : i % 3 === 1 ? '#3bc425' : '#2da31e',
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}

        {/* Success Card */}
        <Card className="bg-[#1a1a1a]/80 border-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#44D92C]/20 to-[#2da31e]/20 p-8 text-center">
            <div className="w-24 h-24 bg-[#44D92C] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-14 h-14 text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Merci pour votre commande !</h1>
            <p className="text-xl text-gray-400">
              Votre commande a été confirmée avec succès
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Référence commande */}
            {orderReference && (
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-gray-400 mb-2">Numéro de commande</p>
                <p className="text-2xl font-bold text-[#44D92C] font-mono">{orderReference}</p>
              </div>
            )}

            {/* Infos */}
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                <Package className="w-6 h-6 text-[#44D92C] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Préparation en cours</p>
                  <p className="text-sm">Votre commande est en cours de préparation et sera expédiée dans les plus brefs délais.</p>
                </div>
              </div>
              
              <p className="text-center">
                Un email de confirmation vous a été envoyé avec tous les détails de votre commande.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={orderReference ? `/compte/commandes/${orderReference}` : '/compte/commandes'} className="flex-1">
                <Button className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold">
                  Voir ma commande
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full h-12 border-white/10 hover:border-[#44D92C]">
                  <Home className="mr-2 w-5 h-5" />
                  Retour à l&apos;accueil
                </Button>
              </Link>
            </div>

            {/* Imprimer */}
            <button 
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#44D92C] transition-colors mx-auto"
            >
              <Printer className="w-4 h-4" />
              <span className="text-sm">Imprimer le récapitulatif</span>
            </button>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <div className="mt-8 p-6 bg-white/5 rounded-xl text-center">
          <p className="text-gray-400 mb-4">
            Recevez nos offres exclusives et nouveautés
          </p>
          <Link href="/compte?tab=newsletter">
            <Button variant="outline" className="border-[#44D92C] text-[#44D92C] hover:bg-[#44D92C] hover:text-black">
              S&apos;inscrire à la newsletter
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 border-4 border-[#44D92C] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
