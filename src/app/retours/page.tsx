import { RotateCcw, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const steps = [
  {
    step: 1,
    title: 'Demande de retour',
    description: 'Connectez-vous à votre compte et créez une demande de retour depuis votre historique de commandes.',
  },
  {
    step: 2,
    title: 'Préparation du colis',
    description: 'Emballez soigneusement le produit dans son emballage d\'origine avec tous les accessoires.',
  },
  {
    step: 3,
    title: 'Expédition',
    description: 'Utilisez l\'étiquette de retour fournie ou envoyez le colis à l\'adresse indiquée.',
  },
  {
    step: 4,
    title: 'Remboursement',
    description: 'Une fois le colis reçu et vérifié, le remboursement est effectué sous 14 jours.',
  },
];

export default function RetoursPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <RotateCcw className="h-16 w-16 text-[#44D92C] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Retours & Remboursements
          </h1>
          <p className="text-[#999] text-lg">
            Vous avez 14 jours pour changer d&apos;avis
          </p>
        </div>

        {/* Étapes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Comment retourner un article ?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((item) => (
              <Card key={item.step} className="bg-[#1a1a1a] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#44D92C]/20 flex items-center justify-center text-[#44D92C] font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-[#999] text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="space-y-6">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#44D92C]" />
                Conditions de retour
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999] space-y-3">
              <p>Pour être accepté, votre retour doit respecter les conditions suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Le produit doit être retourné dans les 14 jours suivant la réception</li>
                <li>Le produit doit être dans son emballage d&apos;origine, non ouvert ou non utilisé</li>
                <li>Tous les accessoires et documentations doivent être inclus</li>
                <li>Le produit ne doit pas avoir été monté sur un véhicule</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#44D92C]" />
                Délais de remboursement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999]">
              <p>
                Une fois votre retour reçu et vérifié, nous procéderons au remboursement 
                dans un délai maximum de 14 jours. Le remboursement sera effectué sur 
                le même moyen de paiement utilisé lors de la commande.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-[#44D92C]" />
                Frais de retour
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999]">
              <p>
                Les frais de retour sont à votre charge, sauf en cas d&apos;erreur de notre part 
                ou de produit défectueux. Dans ce cas, une étiquette de retour prépayée 
                vous sera fournie.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Produits non retournables
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999]">
              <ul className="list-disc pl-6 space-y-2">
                <li>Pièces électriques ou électroniques ouvertes</li>
                <li>Produits sur mesure ou personnalisés</li>
                <li>Huiles, lubrifiants et produits d&apos;entretien entamés</li>
                <li>Équipements de sécurité (casques) descellés</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-[#999] mb-4">
            Besoin d&apos;aide pour votre retour ?
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold rounded-lg transition-colors">
              Contactez-nous
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
