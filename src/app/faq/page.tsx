export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-gray-400">
            Tout ce que vous devez savoir sur vos achats chez Raven Industries
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {/* Commande & Livraison */}
          <FAQSection
            title="🚚 Commande & Livraison"
            questions={[
              {
                q: "Quels sont les délais de livraison ?",
                a: "Nous expédions sous 24h ouvrées. La livraison standard prend 48-72h en France métropolitaine. L'express 24h est disponible pour 9,90€ supplémentaires."
              },
              {
                q: "Livrez-vous en Belgique et Suisse ?",
                a: "Oui ! Nous livrons dans toute l'Europe. Comptez 3-5 jours ouvrés pour la Belgique et 5-7 jours pour la Suisse. Les frais de port sont calculés automatiquement au checkout."
              },
              {
                q: "Comment suivre ma commande ?",
                a: "Dès l'expédition, vous recevez un email avec votre numéro de suivi Colissimo/Chronopost. Vous pouvez aussi suivre votre commande depuis votre compte > Mes commandes."
              },
              {
                q: "La livraison est-elle gratuite ?",
                a: "Oui ! Livraison GRATUITE dès 50€ d'achat en France métropolitaine. En dessous, comptez 5,90€ de frais de port."
              }
            ]}
          />

          {/* Paiement & Sécurité */}
          <FAQSection
            title="💳 Paiement & Sécurité"
            questions={[
              {
                q: "Quels moyens de paiement acceptez-vous ?",
                a: "CB (Visa, Mastercard, Amex), PayPal, virement bancaire et paiement en 3x sans frais avec Alma (dès 100€). Tous les paiements sont sécurisés SSL."
              },
              {
                q: "Mes données bancaires sont-elles sécurisées ?",
                a: "Absolument. Nous utilisons le protocole 3D Secure et ne stockons JAMAIS vos données bancaires. Les paiements sont gérés par des prestataires certifiés PCI-DSS."
              },
              {
                q: "Puis-je payer en plusieurs fois ?",
                a: "Oui, avec Alma vous pouvez payer en 3x sans frais pour tout achat supérieur à 100€. L'option s'affiche automatiquement au moment du paiement."
              }
            ]}
          />

          {/* Produits & Stock */}
          <FAQSection
            title="📦 Produits & Stock"
            questions={[
              {
                q: "Comment savoir si une pièce est compatible avec mon véhicule ?",
                a: "Chaque fiche produit indique les modèles compatibles. Vous pouvez aussi utiliser notre sélecteur de véhicule ou nous contacter avec votre plaque d'immatriculation - nos experts vous répondent en 1h."
              },
              {
                q: "Les pièces sont-elles d'origine ?",
                a: "Nous proposons des pièces d'origine constructeur ET des pièces adaptables de qualité équivalente (TÜV certifiées). Le type est toujours indiqué sur la fiche produit."
              },
              {
                q: "Que faire si la pièce ne fonctionne pas ?",
                a: "Contactez-nous immédiatement. Nous diagnostiquons le problème et vous proposons un échange gratuit ou un remboursement intégral. Garantie satisfait ou remboursé 30 jours."
              },
              {
                q: "Proposez-vous un service de montage ?",
                a: "Nous ne montons pas les pièces, mais nous pouvons vous recommander des garages partenaires près de chez vous. Des tutoriels vidéo sont aussi disponibles pour certains produits."
              }
            ]}
          />

          {/* Retours & SAV */}
          <FAQSection
            title="🔄 Retours & SAV"
            questions={[
              {
                q: "Puis-je retourner un produit ?",
                a: "Oui, vous avez 14 jours pour retourner tout produit non monté et dans son emballage d'origine. Le retour est GRATUIT et le remboursement sous 48h après réception."
              },
              {
                q: "Comment faire une réclamation ?",
                a: "Rendez-vous sur Mon compte > Retours & SAV. Remplissez le formulaire avec photos, nous traitons toutes les réclamations en moins de 24h."
              },
              {
                q: "Quelle est la durée de garantie ?",
                a: "2 ans minimum sur toutes nos pièces (garantie légale). Certains produits ont des garanties constructeur étendues jusqu'à 5 ans - voir fiche produit."
              }
            ]}
          />

          {/* Compte & Facturation */}
          <FAQSection
            title="👤 Compte & Facturation"
            questions={[
              {
                q: "Dois-je créer un compte pour commander ?",
                a: "Non, vous pouvez commander en tant qu'invité. Mais créer un compte vous permet de suivre vos commandes, gérer vos adresses et profiter d'offres exclusives."
              },
              {
                q: "Où trouver ma facture ?",
                a: "Dans Mon compte > Mes commandes, cliquez sur le numéro de commande puis téléchargez votre facture PDF. Elle est aussi envoyée par email après expédition."
              },
              {
                q: "Puis-je modifier mon adresse de livraison ?",
                a: "Oui, tant que la commande n'est pas expédiée (statut 'Préparation'). Contactez-nous par chat ou email avec votre numéro de commande."
              }
            ]}
          />
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#44D92C]/20 to-[#44D92C]/5 border border-[#44D92C]/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-gray-400 mb-6">
            Notre équipe est disponible 7j/7 pour répondre à toutes vos questions
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold rounded-lg transition-colors"
            >
              Nous contacter
            </a>
            <a
              href="tel:+33123456789"
              className="px-6 py-3 border border-white/20 text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              📞 01 23 45 67 89
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ title, questions }: { title: string; questions: Array<{ q: string; a: string }> }) {
  return (
    <div className="bg-[#1a1a1a]/50 border border-white/10 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="space-y-6">
        {questions.map((item, index) => (
          <div key={index} className="border-b border-white/10 last:border-0 pb-6 last:pb-0">
            <h3 className="text-lg font-semibold text-white mb-3">{item.q}</h3>
            <p className="text-gray-400 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "FAQ - Questions Fréquentes | Raven Industries",
  description: "Toutes les réponses à vos questions sur les commandes, livraison, paiements, retours et garanties. Service client 7j/7.",
  keywords: "faq, questions, aide, support, livraison, retour, garantie, paiement",
};
