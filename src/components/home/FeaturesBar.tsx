'use client';

import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Expédition sous 24-48h',
  },
  {
    icon: RotateCcw,
    title: 'Retours gratuits',
    description: 'Sous 30 jours',
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'SSL & 3D Secure',
  },
  {
    icon: Headphones,
    title: 'Support client',
    description: 'Réponse sous 24h',
  },
];

export function FeaturesBar() {
  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
