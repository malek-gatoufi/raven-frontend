import type { Metadata } from 'next';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { Bike, Wrench, Shield, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sélecteur de véhicule - Raven Industries',
  description: 'Trouvez les pièces compatibles avec votre moto, quad, jet-ski ou motoneige. Sélectionnez votre véhicule pour accéder aux pièces de rechange adaptées.',
  openGraph: {
    title: 'Sélecteur de véhicule - Raven Industries',
    description: 'Trouvez les pièces compatibles avec votre véhicule',
  },
};

export default function VehicleSelectorPage() {
  return (
    <main className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#44D92C]/10 border border-[#44D92C]/30 rounded-full text-sm text-[#44D92C] mb-6">
            <Bike className="w-4 h-4" />
            <span>Sélecteur de véhicule</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Trouvez les pièces pour{' '}
            <span className="text-[#44D92C]">votre véhicule</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sélectionnez votre moto, quad, jet-ski ou motoneige pour accéder 
            aux pièces de rechange 100% compatibles avec votre modèle.
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className="max-w-4xl mx-auto mb-16">
          <VehicleSelector variant="full" />
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-[#44D92C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-6 h-6 text-[#44D92C]" />
            </div>
            <h3 className="font-bold mb-2">Pièces OEM & Aftermarket</h3>
            <p className="text-sm text-gray-400">
              Large gamme de pièces d'origine et alternatives de qualité
            </p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-[#44D92C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-[#44D92C]" />
            </div>
            <h3 className="font-bold mb-2">Compatibilité garantie</h3>
            <p className="text-sm text-gray-400">
              Toutes nos références sont vérifiées pour votre véhicule
            </p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-[#44D92C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-[#44D92C]" />
            </div>
            <h3 className="font-bold mb-2">Livraison rapide</h3>
            <p className="text-sm text-gray-400">
              Expédition sous 24h pour les pièces en stock
            </p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-[#44D92C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bike className="w-6 h-6 text-[#44D92C]" />
            </div>
            <h3 className="font-bold mb-2">+50 000 références</h3>
            <p className="text-sm text-gray-400">
              Le plus grand catalogue de pièces pour véhicules de loisir
            </p>
          </div>
        </div>

        {/* Popular brands */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Marques populaires</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'KTM', 'Polaris'].map((brand) => (
              <a
                key={brand}
                href={`/marque/${brand.toLowerCase()}`}
                className="aspect-square bg-white/5 rounded-xl border border-white/10 hover:border-[#44D92C]/50 flex items-center justify-center text-sm font-medium transition-all hover:scale-105"
              >
                {brand}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section for SEO */}
        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <summary className="p-5 cursor-pointer font-semibold flex items-center justify-between list-none">
                Comment trouver les pièces compatibles avec ma moto ?
                <span className="transform group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-5 pb-5 text-gray-400">
                Utilisez notre sélecteur de véhicule ci-dessus. Sélectionnez d'abord le type de véhicule 
                (moto, quad, jet-ski, motoneige), puis la marque, le modèle et l'année. Vous aurez ensuite 
                accès à toutes les pièces compatibles avec votre véhicule.
              </div>
            </details>

            <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <summary className="p-5 cursor-pointer font-semibold flex items-center justify-between list-none">
                Puis-je sauvegarder plusieurs véhicules ?
                <span className="transform group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-5 pb-5 text-gray-400">
                Oui, vous pouvez sauvegarder jusqu'à 5 véhicules dans votre garage personnel. 
                Cela vous permet de basculer facilement entre vos différents véhicules et de 
                retrouver rapidement les pièces compatibles pour chacun.
              </div>
            </details>

            <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <summary className="p-5 cursor-pointer font-semibold flex items-center justify-between list-none">
                Comment savoir si une pièce est d'origine ou aftermarket ?
                <span className="transform group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-5 pb-5 text-gray-400">
                Sur chaque fiche produit, nous indiquons clairement s'il s'agit d'une pièce OEM 
                (origine constructeur) ou aftermarket (équipementier). Les références constructeur 
                sont également affichées pour vous permettre de vérifier la compatibilité.
              </div>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}
