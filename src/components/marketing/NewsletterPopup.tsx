'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const POPUP_DELAY = 5000; // 5 seconds
const POPUP_STORAGE_KEY = 'newsletter-popup-shown';
const POPUP_EXPIRY_DAYS = 7; // Show again after 7 days

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if popup was already shown recently
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
    const now = Date.now();
    
    if (lastShown) {
      const daysSinceShown = (now - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSinceShown < POPUP_EXPIRY_DAYS) {
        return; // Don't show popup
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem(POPUP_STORAGE_KEY, now.toString());
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Integrate with your newsletter API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-lg bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#44D92C]/30 rounded-3xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="p-8 md:p-12">
            {!isSuccess ? (
              <>
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#44D92C]/20 blur-3xl rounded-full" />
                    <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#44D92C] to-[#3bc425] flex items-center justify-center">
                      <Gift className="h-10 w-10 text-black" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
                  Profitez de <span className="text-[#44D92C]">-10%</span>
                </h2>
                <p className="text-gray-400 text-center mb-6">
                  Sur votre première commande en vous inscrivant à notre newsletter
                </p>

                {/* Benefits */}
                <ul className="space-y-2 mb-6 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#44D92C]" />
                    Offres exclusives réservées aux abonnés
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#44D92C]" />
                    Nouveautés et promotions en avant-première
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#44D92C]" />
                    Conseils d'experts et guides techniques
                  </li>
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="Votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold text-base"
                  >
                    {isSubmitting ? 'Inscription...' : 'Obtenir mon code -10%'}
                  </Button>
                </form>

                {/* Fine print */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Pas de spam. Désinscription possible à tout moment.
                </p>
              </>
            ) : (
              /* Success message */
              <div className="text-center py-8">
                <div className="mb-6 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-[#44D92C]/20 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-[#44D92C] flex items-center justify-center">
                      <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Bienvenue !</h3>
                <p className="text-gray-400">
                  Votre code promo <span className="text-[#44D92C] font-bold">WELCOME10</span> arrive dans votre boîte mail
                </p>
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#44D92C]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#44D92C]/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </>
  );
}
