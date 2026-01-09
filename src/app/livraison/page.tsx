import { Truck, Clock, MapPin, Package, Euro, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const deliveryOptions = [
  {
    name: 'Colissimo',
    delay: '2-3 jours ouvrés',
    price: '5,90 €',
    freeFrom: '59 €',
    icon: Package,
  },
  {
    name: 'Chronopost Express',
    delay: '24h',
    price: '9,90 €',
    freeFrom: '99 €',
    icon: Truck,
  },
  {
    name: 'Point Relais',
    delay: '3-5 jours ouvrés',
    price: '3,90 €',
    freeFrom: '49 €',
    icon: MapPin,
  },
];

export default function LivraisonPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Truck className="h-16 w-16 text-[#44D92C] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Livraison</h1>
          <p className="text-[#999] text-lg">
            Découvrez nos options de livraison rapides et sécurisées
          </p>
        </div>

        {/* Options de livraison */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {deliveryOptions.map((option) => (
            <Card key={option.name} className="bg-[#1a1a1a] border-white/10">
              <CardHeader className="text-center">
                <option.icon className="h-10 w-10 text-[#44D92C] mx-auto mb-2" />
                <CardTitle className="text-white">{option.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-[#999]">
                  <Clock className="h-4 w-4" />
                  <span>{option.delay}</span>
                </div>
                <p className="text-2xl font-bold text-[#44D92C]">{option.price}</p>
                <p className="text-sm text-[#999]">
                  Gratuit dès {option.freeFrom} d&apos;achat
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informations */}
        <div className="space-y-8">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Euro className="h-5 w-5 text-[#44D92C]" />
                Frais de port offerts
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999]">
              <p>
                Profitez de la livraison gratuite pour toute commande supérieure au seuil 
                indiqué pour chaque mode de livraison. Les frais de port sont calculés 
                automatiquement lors de la validation de votre panier.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#44D92C]" />
                Délais de préparation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999] space-y-2">
              <p>
                <strong className="text-white">Commande avant 14h :</strong> Expédiée le jour même
              </p>
              <p>
                <strong className="text-white">Commande après 14h :</strong> Expédiée le lendemain ouvré
              </p>
              <p className="text-sm mt-4">
                * Hors week-ends et jours fériés. Sous réserve de disponibilité des produits.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#44D92C]" />
                Suivi de commande
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999]">
              <p>
                Dès l&apos;expédition de votre colis, vous recevrez un email avec un numéro 
                de suivi vous permettant de suivre votre commande en temps réel.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#44D92C]" />
                Zones de livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#999]">
              <p className="mb-4">
                Nous livrons en France métropolitaine, Corse et dans les pays suivants :
              </p>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <li>🇫🇷 France</li>
                <li>🇧🇪 Belgique</li>
                <li>🇱🇺 Luxembourg</li>
                <li>🇨🇭 Suisse</li>
                <li>🇪🇸 Espagne</li>
                <li>🇮🇹 Italie</li>
                <li>🇩🇪 Allemagne</li>
                <li>🇳🇱 Pays-Bas</li>
                <li>🇵🇹 Portugal</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
