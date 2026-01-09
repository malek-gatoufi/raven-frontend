'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur côté client
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-[#1a1a1a] select-none leading-none">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>
        
        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Oups, une erreur s'est produite
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Notre équipe technique a été notifiée. Veuillez réessayer dans quelques instants ou retourner à l'accueil.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={reset}
            className="bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold px-6 py-3"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Réessayer
          </Button>
          
          <Link href="/">
            <Button 
              variant="outline" 
              className="border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#44D92C]/50 px-6 py-3"
            >
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        {/* Code d'erreur si disponible */}
        {error.digest && (
          <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
            <p className="text-gray-500 text-sm">
              Code erreur : <span className="font-mono text-gray-400">{error.digest}</span>
            </p>
          </div>
        )}
        
        {/* Contact support */}
        <div className="mt-12 pt-8 border-t border-[#2a2a2a]">
          <p className="text-gray-500 text-sm mb-4">Le problème persiste ?</p>
          <Link 
            href="/contact" 
            className="inline-flex items-center text-gray-400 hover:text-[#44D92C] transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contactez notre support
          </Link>
        </div>
      </div>
    </div>
  );
}
