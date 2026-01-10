'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp?: any[];
    CRISP_WEBSITE_ID?: string;
  }
}

/**
 * Crisp Live Chat Integration
 * Support temps réel 7j/7
 */
export default function CrispChat() {
  useEffect(() => {
    // Configuration Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = '6e8a4c6d-9f2a-4b5e-8d3c-1a2b3c4d5e6f'; // À remplacer par votre ID Crisp

    // Load Crisp script
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    // Configuration du chat
    script.onload = () => {
      if (window.$crisp) {
        // Personnalisation
        window.$crisp.push(['safe', true]);
        
        // Couleur du thème (vert Raven)
        window.$crisp.push(['config', 'color:theme', ['#44D92C']]);
        
        // Position (droite)
        window.$crisp.push(['config', 'position:reverse', [false]]);
        
        // Messages automatiques
        window.$crisp.push([
          'on',
          'session:loaded',
          () => {
            // Message de bienvenue après 10 secondes
            setTimeout(() => {
              if (window.$crisp) {
                window.$crisp.push([
                  'do',
                  'message:show',
                  [
                    'text',
                    "👋 Besoin d'aide pour trouver votre pièce ? Notre équipe est disponible 7j/7 !",
                  ],
                ]);
              }
            }, 10000);
          },
        ]);

        // Tracking des pages
        window.$crisp.push(['set', 'session:data', [[['page', window.location.pathname]]]]);
      }
    };

    return () => {
      // Cleanup
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:hide']);
      }
    };
  }, []);

  return null; // Ce composant n'affiche rien directement
}

/**
 * Helper pour ouvrir le chat programmatiquement
 */
export const openCrispChat = () => {
  if (window.$crisp) {
    window.$crisp.push(['do', 'chat:open']);
  }
};

/**
 * Helper pour envoyer un message pré-rempli
 */
export const sendCrispMessage = (message: string) => {
  if (window.$crisp) {
    window.$crisp.push(['set', 'message:text', [message]]);
    window.$crisp.push(['do', 'chat:open']);
  }
};

/**
 * Helper pour définir les données utilisateur
 */
export const setCrispUserData = (data: {
  email?: string;
  name?: string;
  phone?: string;
  [key: string]: any;
}) => {
  if (window.$crisp) {
    if (data.email) {
      window.$crisp.push(['set', 'user:email', [data.email]]);
    }
    if (data.name) {
      window.$crisp.push(['set', 'user:nickname', [data.name]]);
    }
    if (data.phone) {
      window.$crisp.push(['set', 'user:phone', [data.phone]]);
    }
    
    // Données supplémentaires
    const sessionData = Object.entries(data)
      .filter(([key]) => !['email', 'name', 'phone'].includes(key))
      .map(([key, value]) => [key, value]);
    
    if (sessionData.length > 0) {
      window.$crisp.push(['set', 'session:data', [sessionData]]);
    }
  }
};
