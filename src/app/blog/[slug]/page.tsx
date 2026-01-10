import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { notFound } from 'next/navigation';

interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

// Article complet (exemple pour le tutoriel plaquettes de frein)
const articles: Record<string, BlogArticle> = {
  'comment-changer-plaquettes-frein-moto': {
    slug: 'comment-changer-plaquettes-frein-moto',
    title: 'Comment changer les plaquettes de frein de votre moto ?',
    excerpt:
      'Guide complet pas-à-pas pour remplacer vos plaquettes de frein en toute sécurité. Outillage nécessaire, précautions et astuces de pro.',
    image: '/images/blog/plaquettes-frein.jpg',
    category: 'Tutoriel',
    author: 'Thomas Mécanique',
    date: '2026-01-08',
    readTime: '8 min',
    tags: ['freinage', 'sécurité', 'entretien', 'tutoriel', 'moto'],
    content: `
# Pourquoi changer vos plaquettes de frein ?

Les plaquettes de frein sont des **pièces d'usure essentielles** à votre sécurité. Elles doivent être remplacées régulièrement pour garantir un freinage optimal. En moyenne, des plaquettes de frein se changent tous les **15 000 à 30 000 km** selon votre type de conduite.

## Signes d'usure à surveiller

- ✅ Épaisseur inférieure à 2-3 mm
- ✅ Bruit de grincement au freinage
- ✅ Voyant d'usure allumé (si équipé)
- ✅ Sensation d'éponge à la poignée de frein
- ✅ Distance de freinage augmentée

---

# Outillage nécessaire

Avant de commencer, assurez-vous d'avoir tout le matériel :

## Outils indispensables

- 🔧 Clés Allen (4, 5, 6 mm selon modèle)
- 🔧 Clé plate 10-14 mm
- 🔧 Tournevis plat
- 🔧 Pince à bec ou repoussoir de piston
- 🔧 Graisse cuivre haute température
- 🔧 Nettoyant frein (spray)

## Équipement de protection

- 🧤 Gants
- 🥽 Lunettes de protection
- 🧽 Chiffons propres

**Budget moyen :** 30-80€ pour une paire de plaquettes de qualité (Brembo, EBC, Ferodo).

---

# Étape 1 : Préparation

## Sécurité avant tout

1. **Garez la moto sur une surface plane** et stable
2. **Enclenchez la 1ère vitesse** (pour les freins arrière)
3. **Laissez refroidir les freins** si vous venez de rouler (30 min minimum)
4. **Débranchez la batterie** si vous touchez aux freins ABS

## Nettoyage préliminaire

Nettoyez la zone autour de l'étrier avec du **nettoyant frein**. Cela évitera que des impuretés ne contaminent le système lors du démontage.

---

# Étape 2 : Dépose de la roue (facultatif)

Pour les freins **avant**, vous pouvez travailler sans déposer la roue sur la plupart des modèles. Pour l'**arrière**, la dépose facilite l'accès.

## Si dépose nécessaire :

1. Desserrez l'axe de roue
2. Maintenez la moto sur béquille centrale ou paddock
3. Retirez l'axe de roue
4. Dégagez la roue délicatement

⚠️ **Important :** Ne touchez JAMAIS la poignée de frein roue démontée (risque d'éjection des pistons).

---

# Étape 3 : Démontage de l'étrier

## Localisation des vis

Sur la plupart des motos, **2 vis Allen** maintiennent l'étrier au support (en haut et en bas).

## Procédure :

1. Repérez les vis de fixation (souvent en **Allen 6 ou 8 mm**)
2. Dévissez les 2 vis **sans forcer** (couple de serrage 25-35 Nm généralement)
3. Dégagez l'étrier du disque en le faisant pivoter
4. Suspendez-le avec un **fil de fer** (jamais en tension sur la durite !)

💡 **Astuce pro :** Mettez les vis dans un petit pot pour ne pas les perdre.

---

# Étape 4 : Retrait des anciennes plaquettes

## Extraction :

1. Retirez la **goupille de maintien** (clip ou axe traversant)
2. Extrayez les plaquettes usagées **délicatement**
3. Nettoyez l'intérieur de l'étrier avec du **nettoyant frein**
4. Inspectez les **pistons** (pas de fuite, pas de corrosion)

## Contrôle du disque

Profitez-en pour vérifier :
- ✅ Épaisseur du disque (mini 4-4.5 mm selon modèle)
- ✅ Absence de voile (disque déformé)
- ✅ Pas de rayures profondes

---

# Étape 5 : Repousser les pistons

C'est l'étape **la plus importante** ! Les nouveaux plaquettes étant plus épaisses, il faut repousser les pistons dans leur logement.

## Méthode :

1. Utilisez un **repoussoir de piston** ou une **pince à bec large**
2. Repoussez progressivement en alternant les pistons si double piston
3. Allez-y **doucement** pour ne pas endommager les joints
4. Vérifiez que le niveau de liquide de frein ne déborde pas du bocal

⚠️ **Attention :** Si le bocal est plein, retirez du liquide avec une seringue avant de repousser.

---

# Étape 6 : Installation des nouvelles plaquettes

## Préparation :

1. Déposez une fine couche de **graisse cuivre** sur le dos des plaquettes (côté piston uniquement)
2. Ne mettez JAMAIS de graisse côté garniture (côté disque)

## Montage :

1. Insérez les nouvelles plaquettes dans l'étrier
2. Replacez la **goupille de maintien**
3. Vérifiez que les plaquettes coulissent librement

💡 **Bon à savoir :** Certaines plaquettes ont un **indicateur d'usure** à positionner vers le haut.

---

# Étape 7 : Remontage de l'étrier

## Procédure inverse :

1. Repositionnez l'étrier sur le **support**
2. Alignez les trous de fixation
3. Vissez les **2 vis** à la main d'abord
4. Serrez au **couple recommandé** (25-35 Nm généralement)

🔧 **Couple de serrage** : Consultez votre revue technique pour la valeur exacte.

---

# Étape 8 : Rodage des plaquettes (CRUCIAL)

Les nouvelles plaquettes doivent être **rodées** pour atteindre leur efficacité maximale.

## Procédure de rodage :

1. **Pompez la poignée de frein** plusieurs fois jusqu'à sentir une résistance ferme
2. Roulez à **30-50 km/h**
3. Effectuez **10-15 freinages légers** pour chauffer progressivement
4. Laissez refroidir **5 minutes**
5. Répétez le cycle 2-3 fois

⚠️ **ATTENTION :** Évitez les **freinages d'urgence** pendant les premiers **200 km** !

---

# Étape 9 : Contrôle final

## Checklist avant de rouler :

- ✅ Poignée de frein ferme (pas d'air dans le circuit)
- ✅ Aucune fuite de liquide de frein
- ✅ Niveau du bocal correct (entre MIN et MAX)
- ✅ Vis d'étrier serrées au couple
- ✅ Roue correctement remontée et axe serré
- ✅ Test de freinage à l'arrêt (roue doit bloquer)

---

# Foire aux questions (FAQ)

## Combien de temps dure le changement ?

**30 à 60 minutes** pour un débutant, **15-20 minutes** pour un mécanicien confirmé.

## Puis-je changer les plaquettes sans l'étrier ?

Non, il faut retirer l'étrier pour accéder aux plaquettes sur la majorité des motos modernes.

## Dois-je purger le circuit après le changement ?

**Non**, sauf si vous avez ouvert le circuit (durite déconnectée) ou si de l'air est entré.

## Quelle marque de plaquettes choisir ?

Pour un usage route :
- 🥇 **Brembo** (OEM, excellent rapport qualité/prix)
- 🥈 **EBC HH** (freinage puissant, légère usure du disque)
- 🥉 **Ferodo** (bonne polyvalence)

Pour la piste : **Brembo Racing, EBC GPFAX**

## Puis-je mélanger différentes marques avant/arrière ?

Oui, pas de problème. Mais gardez la même marque **gauche/droite** pour un freinage équilibré.

---

# En résumé

Le changement de plaquettes de frein est une **opération simple** à la portée de tout motard bricoleur. Respectez bien les étapes, prenez votre temps, et n'oubliez surtout pas le **rodage** !

## Points clés à retenir :

1. ✅ Contrôlez l'épaisseur tous les **5 000 km**
2. ✅ Changez dès que < **3 mm** d'épaisseur
3. ✅ Graissez uniquement le **dos des plaquettes**
4. ✅ Rodez sur **200 km** sans freinage brutal
5. ✅ Vérifiez le niveau de liquide de frein

💰 **Économie réalisée :** 50-100€ en faisant soi-même vs garage.

---

## Vous avez besoin de plaquettes de frein ?

👉 **Découvrez notre sélection** de plaquettes pour toutes marques : Yamaha, Honda, Suzuki, Kawasaki, BMW, KTM...

[Voir les plaquettes de frein →](/category/plaquettes-frein)

**Livraison 24-48h** | **Garantie 2 ans** | **Prix imbattables**
    `,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = articles[params.slug];

  if (!article) {
    return {
      title: 'Article non trouvé',
    };
  }

  return {
    title: `${article.title} | Blog Raven Industries`,
    description: article.excerpt,
    keywords: article.tags.join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#44D92C] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au blog
      </Link>

      {/* Article header */}
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#44D92C]/20 text-[#44D92C] text-sm font-semibold rounded-full">
              {article.category}
            </span>
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{article.readTime} de lecture</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white hover:bg-[#2a2a2a] transition-colors">
              <Share2 className="h-4 w-4" />
              Partager
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white hover:bg-[#2a2a2a] transition-colors">
              <Bookmark className="h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Featured image placeholder */}
        <div className="relative h-96 bg-[#2a2a2a] rounded-xl mb-12 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="text-8xl mb-4">🔧</div>
            <div>Image à venir</div>
          </div>
        </div>

        {/* Article content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{
              __html: article.content
                .split('\n')
                .map((line) => {
                  // Titres
                  if (line.startsWith('# ')) {
                    return `<h1 class="text-3xl font-bold text-white mt-12 mb-6">${line.slice(2)}</h1>`;
                  }
                  if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-bold text-white mt-8 mb-4">${line.slice(3)}</h2>`;
                  }
                  if (line.startsWith('### ')) {
                    return `<h3 class="text-xl font-bold text-white mt-6 mb-3">${line.slice(4)}</h3>`;
                  }
                  // Séparateur
                  if (line === '---') {
                    return '<hr class="my-8 border-white/10" />';
                  }
                  // Listes
                  if (line.startsWith('- ')) {
                    return `<li class="text-gray-300 ml-6">${line.slice(2)}</li>`;
                  }
                  // Paragraphes
                  if (line.trim()) {
                    return `<p class="text-gray-300 leading-relaxed mb-4">${line}</p>`;
                  }
                  return '';
                })
                .join(''),
            }}
          />
        </div>

        {/* CTA produits */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#44D92C]/20 to-[#44D92C]/5 border border-[#44D92C]/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            Besoin de pièces pour votre moto ?
          </h3>
          <p className="text-gray-400 mb-6">
            Découvrez notre catalogue de {'>'}30 000 références en stock. Livraison 24-48h partout
            en France.
          </p>
          <Link
            href="/category/22-motos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold rounded-lg transition-colors"
          >
            Voir les pièces moto
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </Link>
        </div>

        {/* Articles similaires */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-6">Articles similaires</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 hover:border-[#44D92C]/50 transition-all"
              >
                <div className="h-32 bg-[#2a2a2a] rounded-lg mb-3"></div>
                <h4 className="text-white font-semibold mb-2">Article similaire {i}</h4>
                <p className="text-sm text-gray-400">Description courte de l'article...</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
