import { Shield } from 'lucide-react';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-[#44D92C] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-[#999]">Dernière mise à jour : Décembre 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Collecte des données</h2>
            <p className="text-[#999] leading-relaxed">
              Raven Industries collecte les données personnelles nécessaires au traitement 
              de vos commandes : nom, prénom, adresse, email, téléphone. Ces données sont 
              collectées lors de la création de votre compte ou lors de la passation de commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Utilisation des données</h2>
            <p className="text-[#999] leading-relaxed mb-4">
              Vos données personnelles sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-[#999] space-y-2">
              <li>Traiter et expédier vos commandes</li>
              <li>Vous contacter en cas de besoin</li>
              <li>Vous envoyer des informations sur nos produits (avec votre consentement)</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Protection des données</h2>
            <p className="text-[#999] leading-relaxed">
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles 
              pour protéger vos données personnelles contre tout accès non autorisé, 
              modification, divulgation ou destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
            <p className="text-[#999] leading-relaxed">
              Notre site utilise des cookies pour améliorer votre expérience de navigation, 
              mémoriser vos préférences et analyser le trafic. Vous pouvez désactiver les 
              cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Vos droits</h2>
            <p className="text-[#999] leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-[#999] space-y-2">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact DPO</h2>
            <p className="text-[#999] leading-relaxed">
              Pour exercer vos droits ou pour toute question relative à la protection 
              de vos données, vous pouvez nous contacter à : dpo@ravenindustries.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
