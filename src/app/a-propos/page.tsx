import { Award, Users, Truck, Shield, Clock, Wrench } from 'lucide-react';

const stats = [
  { value: '15+', label: 'Années d\'expérience' },
  { value: '30k+', label: 'Références en stock' },
  { value: '50k+', label: 'Clients satisfaits' },
  { value: '24h', label: 'Expédition rapide' },
];

const values = [
  {
    icon: Award,
    title: 'Qualité',
    description: 'Nous sélectionnons uniquement des pièces de qualité premium, testées et certifiées.',
  },
  {
    icon: Users,
    title: 'Expertise',
    description: 'Notre équipe de passionnés vous conseille et vous accompagne dans vos projets.',
  },
  {
    icon: Truck,
    title: 'Rapidité',
    description: 'Expédition sous 24h pour toute commande passée avant 14h.',
  },
  {
    icon: Shield,
    title: 'Garantie',
    description: 'Toutes nos pièces sont garanties 2 ans pour votre tranquillité.',
  },
  {
    icon: Clock,
    title: 'Disponibilité',
    description: 'Service client disponible 6j/7 pour répondre à toutes vos questions.',
  },
  {
    icon: Wrench,
    title: 'Compatibilité',
    description: 'Base de données complète pour trouver la pièce exacte pour votre véhicule.',
  },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#44D92C]/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            À propos de <span className="text-[#44D92C]">Raven Industries</span>
          </h1>
          <p className="text-xl text-[#999] max-w-3xl mx-auto">
            Depuis 2010, nous sommes le spécialiste français de la pièce détachée 
            pour moto, quad, jet-ski et motoneige. Notre mission : vous fournir 
            des pièces de qualité au meilleur prix.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#44D92C] mb-2">
                  {stat.value}
                </p>
                <p className="text-[#999]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Notre histoire
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-[#999] text-lg leading-relaxed mb-6">
              Raven Industries est née de la passion de deux amis pour les sports mécaniques. 
              Frustrés par la difficulté de trouver des pièces de qualité à des prix raisonnables, 
              nous avons décidé de créer notre propre entreprise en 2010.
            </p>
            <p className="text-[#999] text-lg leading-relaxed mb-6">
              Aujourd&apos;hui, nous sommes fiers d&apos;être l&apos;un des leaders français de la vente 
              de pièces détachées en ligne. Avec plus de 30 000 références en stock et une 
              équipe de passionnés, nous accompagnons chaque jour des milliers de motards, 
              quadeurs et amateurs de sports nautiques.
            </p>
            <p className="text-[#999] text-lg leading-relaxed">
              Notre engagement reste le même qu&apos;au premier jour : vous offrir les meilleures 
              pièces, au meilleur prix, avec un service client irréprochable.
            </p>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 md:py-24 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Nos valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div 
                key={value.title}
                className="p-6 rounded-2xl bg-[#1a1a1a]/80 border border-white/10 hover:border-[#44D92C]/30 transition-all"
              >
                <value.icon className="h-10 w-10 text-[#44D92C] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-[#999]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
