'use client';

import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Headphones,
  Bike,
  Waves,
  Snowflake
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const vehicleLinks = [
  { name: 'Pièces Moto', href: '/category/22-motos', icon: Bike },
  { name: 'Pièces Quad', href: '/category/24-quads', icon: Bike },
  { name: 'Pièces Scooter', href: '/category/25-scooters', icon: Bike },
  { name: 'Pièces Motoneige', href: '/category/21-motos-neiges', icon: Snowflake },
];

const shopLinks = [
  { name: 'Nouveautés', href: '/nouveautes' },
  { name: 'Promotions', href: '/promotions' },
  { name: 'Meilleures ventes', href: '/best-sellers' },
  { name: 'Toutes les marques', href: '/marques' },
];

const customerLinks = [
  { name: 'Mon compte', href: '/compte' },
  { name: 'Mes commandes', href: '/compte/commandes' },
  { name: 'Suivi de commande', href: '/suivi-commande' },
  { name: 'Retours & SAV', href: '/retours' },
];

const infoLinks = [
  { name: 'À propos', href: '/a-propos' },
  { name: 'Livraison', href: '/livraison' },
  { name: 'Conditions générales', href: '/cgv' },
  { name: 'Politique de confidentialité', href: '/confidentialite' },
  { name: 'Contact', href: '/contact' },
];

const features = [
  { icon: Truck, title: 'Livraison rapide', desc: '24-48h' },
  { icon: CreditCard, title: 'Paiement sécurisé', desc: 'CB, PayPal' },
  { icon: Shield, title: 'Garantie', desc: '2 ans' },
  { icon: Headphones, title: 'Support', desc: '7j/7' },
];

export function Footer() {
  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Handle newsletter signup
  }

  return (
    <footer className="footer-dark mt-auto">
      {/* Features bar */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#44D92C]/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-[#44D92C]" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-[#999]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#44D92C]/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-black text-[#44D92C]">R</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">RAVEN</span>
                <span className="text-xl font-light text-[#999] ml-1">INDUSTRIES</span>
              </div>
            </Link>
            
            <p className="text-[#999] mb-6 max-w-sm">
              Spécialiste de la pièce détachée pour moto, quad, jet-ski et motoneige. 
              Des milliers de références au meilleur prix.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3">Newsletter</h4>
              <p className="text-sm text-[#999] mb-3">
                Recevez nos offres exclusives et nouveautés
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-[#666]"
                />
                <Button 
                  type="submit"
                  className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold px-6"
                >
                  OK
                </Button>
              </form>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#999] hover:bg-[#44D92C]/20 hover:text-[#44D92C] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#999] hover:bg-[#44D92C]/20 hover:text-[#44D92C] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#999] hover:bg-[#44D92C]/20 hover:text-[#44D92C] transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Véhicules */}
          <div>
            <h4 className="font-semibold text-white mb-4">Nos pièces</h4>
            <ul className="space-y-2">
              {vehicleLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-2 text-[#999] hover:text-[#44D92C] transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-semibold text-white mb-4">Boutique</h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#999] hover:text-[#44D92C] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-white mt-6 mb-4">Mon compte</h4>
            <ul className="space-y-2">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#999] hover:text-[#44D92C] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a 
                  href="tel:+33123456789"
                  className="flex items-center gap-2 text-[#999] hover:text-[#44D92C] transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  01 23 45 67 89
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@ravenindustries.fr"
                  className="flex items-center gap-2 text-[#999] hover:text-[#44D92C] transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  contact@ravenindustries.fr
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#999]">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  123 Rue du Commerce<br />
                  75001 Paris, France
                </span>
              </li>
            </ul>

            <h4 className="font-semibold text-white mb-4">Informations</h4>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#999] hover:text-[#44D92C] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#666]">
              © {new Date().getFullYear()} Raven Industries. Tous droits réservés.
            </p>
            
            {/* Payment methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#666]">Paiement sécurisé :</span>
              <div className="flex items-center gap-2">
                <div className="h-8 px-3 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div className="h-8 px-3 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MC</span>
                </div>
                <div className="h-8 px-3 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-[#0070ba]">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
