import { FileText } from 'lucide-react';

export default function CGVPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-[#44D92C] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-[#999]">Dernière mise à jour : Décembre 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Objet</h2>
            <p className="text-[#999] leading-relaxed">
              Les présentes conditions générales de vente régissent les relations contractuelles 
              entre la société Raven Industries et ses clients dans le cadre de la vente de 
              pièces détachées pour véhicules motorisés via le site internet ravenindustries.fr.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Prix</h2>
            <p className="text-[#999] leading-relaxed">
              Les prix de nos produits sont indiqués en euros toutes taxes comprises (TVA française). 
              Raven Industries se réserve le droit de modifier ses prix à tout moment. 
              Les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Commande</h2>
            <p className="text-[#999] leading-relaxed">
              La commande n&apos;est définitivement validée qu&apos;après acceptation du paiement. 
              Un email de confirmation vous sera envoyé récapitulant votre commande. 
              En cas de problème de stock, nous vous contacterons dans les plus brefs délais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Paiement</h2>
            <p className="text-[#999] leading-relaxed mb-4">
              Le paiement s&apos;effectue en ligne par :
            </p>
            <ul className="list-disc pl-6 text-[#999] space-y-2">
              <li>Carte bancaire (Visa, Mastercard, CB)</li>
              <li>PayPal</li>
              <li>Virement bancaire (sur demande)</li>
            </ul>
            <p className="text-[#999] leading-relaxed mt-4">
              Toutes les transactions sont sécurisées par protocole SSL.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Livraison</h2>
            <p className="text-[#999] leading-relaxed">
              Les délais de livraison sont indiqués sur la page livraison et varient selon 
              le mode d&apos;expédition choisi. Ces délais sont donnés à titre indicatif et ne 
              sauraient engager la responsabilité de Raven Industries en cas de retard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Droit de rétractation</h2>
            <p className="text-[#999] leading-relaxed">
              Conformément à la législation en vigueur, vous disposez d&apos;un délai de 14 jours 
              à compter de la réception de votre commande pour exercer votre droit de rétractation. 
              Les produits doivent être retournés dans leur emballage d&apos;origine et en parfait état.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Garantie</h2>
            <p className="text-[#999] leading-relaxed">
              Tous nos produits bénéficient de la garantie légale de conformité (2 ans) et 
              de la garantie contre les vices cachés. En cas de défaut, contactez notre 
              service client pour un échange ou un remboursement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact</h2>
            <p className="text-[#999] leading-relaxed">
              Pour toute question concernant ces conditions générales de vente, vous pouvez 
              nous contacter par email à contact@ravenindustries.fr ou par téléphone au 01 23 45 67 89.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
