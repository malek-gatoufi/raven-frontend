'use client';

import { useInstallPrompt } from '@/lib/pwa';
import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
            <Download className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">
              Installer l'application
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Accédez rapidement à Raven Industries depuis votre écran d'accueil
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={promptInstall}
                size="sm"
                className="flex-1"
              >
                Installer
              </Button>
              <Button
                onClick={() => setDismissed(true)}
                variant="ghost"
                size="sm"
                className="px-2"
              >
                Plus tard
              </Button>
            </div>
          </div>
          
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
