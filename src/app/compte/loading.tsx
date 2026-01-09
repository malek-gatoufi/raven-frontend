import { Loader2, Package } from 'lucide-react';

export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#44D92C]/10 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-[#44D92C] animate-pulse" />
          </div>
          <p className="text-gray-400 mb-2">Chargement de votre compte</p>
          <Loader2 className="w-6 h-6 text-[#44D92C] animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
}
