import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-[#1a1a1a] border-t-[#44D92C] animate-spin mx-auto"></div>
          <Loader2 className="w-10 h-10 text-[#44D92C] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-400 animate-pulse">Chargement...</p>
      </div>
    </div>
  );
}
