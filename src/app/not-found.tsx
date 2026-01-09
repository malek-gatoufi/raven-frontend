import Link from 'next/link';
import { Home, Search, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-[#1a1a1a] select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#44D92C]/10 flex items-center justify-center animate-pulse">
              <Ghost className="w-12 h-12 text-[#44D92C]" />
            </div>
          </div>
        </div>
        
        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page introuvable
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Oups ! La page que vous recherchez semble avoir disparu dans les méandres du web. 
          Elle a peut-être été déplacée ou n'existe plus.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button className="bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold px-6 py-3">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Link href="/recherche">
            <Button 
              variant="outline" 
              className="border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#44D92C]/50 px-6 py-3"
            >
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </Link>
        </div>
        
        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-[#2a2a2a]">
          <p className="text-gray-500 text-sm mb-4">Liens utiles</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/contact" className="text-gray-400 hover:text-[#44D92C] transition-colors">
              Contact
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/cms" className="text-gray-400 hover:text-[#44D92C] transition-colors">
              Informations légales
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/marque" className="text-gray-400 hover:text-[#44D92C] transition-colors">
              Nos marques
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
