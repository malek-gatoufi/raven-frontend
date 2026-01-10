/**
 * Page offline pour PWA
 */

import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RetryButton } from './retry-button';

export const metadata = {
  title: 'Hors ligne - Raven Industries',
  description: 'Vous êtes actuellement hors ligne',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-200 p-6">
            <WifiOff className="h-16 w-16 text-gray-600" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Vous êtes hors ligne
        </h1>

        <p className="mb-8 text-gray-600">
          Impossible de charger cette page. Vérifiez votre connexion internet
          et réessayez.
        </p>

        <div className="space-y-4">
          <RetryButton />

          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Astuce:</strong> Certaines pages peuvent être disponibles
            hors ligne grâce à notre technologie PWA.
          </p>
        </div>
      </div>
    </div>
  );
}
