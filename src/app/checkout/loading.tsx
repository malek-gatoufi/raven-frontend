import { Loader2 } from 'lucide-react';

export default function CheckoutLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-[#1a1a1a] border-t-[#44D92C] animate-spin mx-auto"></div>
        </div>
        <p className="text-gray-400 text-lg mb-2">Préparation du paiement</p>
        <p className="text-gray-600 text-sm">Veuillez patienter...</p>
      </div>
    </div>
  );
}
