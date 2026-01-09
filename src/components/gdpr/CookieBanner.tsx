'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'raven_cookie_consent';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Toujours requis
    analytics: false,
    marketing: false,
    timestamp: 0,
  });

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      const parsed = JSON.parse(savedConsent);
      setConsent(parsed);
      // Réafficher après 1 an
      if (Date.now() - parsed.timestamp > 365 * 24 * 60 * 60 * 1000) {
        setIsVisible(true);
      }
    } else {
      // Délai pour ne pas bloquer le rendu initial
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = { ...newConsent, timestamp: Date.now() };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setIsVisible(false);
    
    // Appliquer le consentement aux services
    applyConsent(consentWithTimestamp);
  };

  const applyConsent = (consent: CookieConsent) => {
    // Analytics (Google Analytics, Matomo, etc.)
    if (consent.analytics && typeof window !== 'undefined') {
      // Activer Google Analytics si configuré
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    }
    
    // Marketing (Facebook Pixel, etc.)
    if (consent.marketing && typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  };

  const savePreferences = () => {
    saveConsent(consent);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => {}} />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
          {!showSettings ? (
            /* Vue principale */
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#44D92C]/10 flex items-center justify-center shrink-0">
                  <Cookie className="w-6 h-6 text-[#44D92C]" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Nous utilisons des cookies 🍪
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Ce site utilise des cookies pour améliorer votre expérience. Les cookies essentiels 
                    sont nécessaires au fonctionnement du site. Vous pouvez choisir d'accepter ou de 
                    refuser les cookies optionnels.{' '}
                    <Link href="/cms/politique-cookies" className="text-[#44D92C] hover:underline">
                      En savoir plus
                    </Link>
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={acceptAll}
                      className="bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold"
                    >
                      Tout accepter
                    </Button>
                    
                    <Button
                      onClick={rejectAll}
                      variant="outline"
                      className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                    >
                      Tout refuser
                    </Button>
                    
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Personnaliser
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Vue paramètres */
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Paramètres des cookies</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Cookies nécessaires */}
                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Cookies nécessaires</h4>
                    <p className="text-gray-500 text-sm">
                      Essentiels au fonctionnement du site (panier, session)
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-[#44D92C]/30 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-[#44D92C] rounded-full" />
                  </div>
                </div>
                
                {/* Cookies analytics */}
                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Cookies analytiques</h4>
                    <p className="text-gray-500 text-sm">
                      Nous aident à comprendre comment vous utilisez le site
                    </p>
                  </div>
                  <button
                    onClick={() => setConsent(prev => ({ ...prev, analytics: !prev.analytics }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      consent.analytics ? 'bg-[#44D92C]/30 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full transition-colors ${
                      consent.analytics ? 'bg-[#44D92C]' : 'bg-gray-500'
                    }`} />
                  </button>
                </div>
                
                {/* Cookies marketing */}
                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Cookies marketing</h4>
                    <p className="text-gray-500 text-sm">
                      Utilisés pour vous proposer des publicités pertinentes
                    </p>
                  </div>
                  <button
                    onClick={() => setConsent(prev => ({ ...prev, marketing: !prev.marketing }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      consent.marketing ? 'bg-[#44D92C]/30 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full transition-colors ${
                      consent.marketing ? 'bg-[#44D92C]' : 'bg-gray-500'
                    }`} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={savePreferences}
                  className="bg-[#44D92C] hover:bg-[#3bc025] text-black font-semibold"
                >
                  Sauvegarder mes préférences
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
