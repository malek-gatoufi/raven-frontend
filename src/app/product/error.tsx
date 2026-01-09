'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Search } from 'lucide-react';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Product Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">
          Produit non disponible
        </h1>
        <p className="text-gray-400 mb-8">
          Ce produit n'est pas disponible actuellement ou une erreur s'est produite. 
          Veuillez réessayer ou rechercher un autre produit.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={reset}
            className="bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Réessayer
          </Button>
          
          <Link href="/recherche">
            <Button 
              variant="outline" 
              className="border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
            >
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-gray-600 text-sm">
            Réf: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
