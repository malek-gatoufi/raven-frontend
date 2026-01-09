import { 
  HelpCircle, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  Shield, 
  Mail, 
  Phone,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
  {
    icon: Truck,
    title: 'Livraison',
    description: 'Délais, tarifs et suivi de colis',
    href: '/livraison',
    color: 'text-blue-400',
  },
  {
    icon: CreditCard,
    title: 'Paiement',
    description: 'Moyens de paiement acceptés',
    href: '/cgv',
    color: 'text-green-400',
  },
  {
    icon: RotateCcw,
    title: 'Retours & Remboursements',
    description: 'Politique de retour sous 14 jours',
    href: '/retours',
    color: 'text-amber-400',
  },
  {
    icon: Shield,
    title: 'Garantie',
    description: 'Garantie 2 ans sur nos produits',
    href: '/cgv',
    color: 'text-purple-400',
  },
];

export default function AidePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-[#44D92C] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Centre d&apos;aide</h1>
          <p className="text-[#999] text-lg">
            Comment pouvons-nous vous aider ?
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {faqItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="bg-[#1a1a1a] border-white/10 hover:border-[#44D92C]/50 transition-all h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-sm text-[#999]">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#666]" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Contact */}
        <Card className="bg-gradient-to-br from-[#44D92C]/10 to-transparent border-[#44D92C]/30">
          <CardHeader>
            <CardTitle className="text-white">Besoin d&apos;aide supplémentaire ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#999]">
              Notre équipe est disponible du lundi au vendredi de 9h à 18h
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="tel:+33123456789"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="h-4 w-4 text-[#44D92C]" />
                01 23 45 67 89
              </a>
              <a 
                href="mailto:contact@ravenindustries.fr"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <Mail className="h-4 w-4 text-[#44D92C]" />
                contact@ravenindustries.fr
              </a>
            </div>
            <Link href="/contact">
              <button className="mt-4 px-6 py-2 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold rounded-lg transition-colors">
                Nous contacter
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
