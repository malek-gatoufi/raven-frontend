# Changelog - Raven Industries Frontend

## [2.0.0] - 2025-12-13

### ✨ Nouvelles fonctionnalités

#### Pages Compte Client
- **Bons de réduction** (`/compte/bons-reduction`)
  - Affichage des vouchers actifs et expirés
  - Copie rapide des codes promo
  - Détails: valeur, minimum, date d'expiration
  - Compatible mobile avec design responsive

- **Retours produits** (`/compte/retours`)
  - Liste des demandes de retour avec statuts
  - Détail des produits concernés
  - Téléchargement des bons de retour PDF
  - Lien vers commandes associées

- **Avoirs** (`/compte/avoirs`)
  - Liste des credit slips/avoirs
  - Téléchargement PDF
  - Table responsive desktop/mobile
  - Lien vers commandes

- **Réinitialisation mot de passe** (`/mot-de-passe-oublie/[token]`)
  - Validation du mot de passe en temps réel
  - Indicateurs de force de mot de passe
  - Gestion des tokens expirés
  - Confirmation visuelle de succès

#### Système de notifications
- **Toast notifications** (`/components/ui/toast.tsx`)
  - 4 types: success, error, warning, info
  - Auto-dismiss configurable
  - Empilables
  - Animations fluides
  - Positionnement bottom-right

#### Gestion d'erreurs améliorée
- **Page erreur 500 globale** (`/error.tsx`)
  - Design cohérent avec le site
  - Bouton retry
  - Lien vers support
  - Code d'erreur digest

- **Pages erreur spécifiques**
  - Checkout: erreur paiement avec retour panier
  - Compte: erreur données avec reconnexion
  - Produit: produit non disponible
  - Catégorie: catégorie introuvable

#### Loading states
- **Pages loading.tsx** ajoutées dans:
  - Root (`/loading.tsx`)
  - Checkout (`/checkout/loading.tsx`)
  - Compte (`/compte/loading.tsx`)
  - Produit (`/product/loading.tsx`)

#### Raccourcis Dashboard
- Ajout de 4 raccourcis visuels dans le dashboard compte
- Liens directs: Bons, Retours, Avoirs, Contact
- Design avec icônes et hover effects

### 🔌 Backend API

#### Nouveaux contrôleurs PrestaShop
```php
modules/ravenapi/controllers/front/
├── vouchers.php     → GET /ravenapi/vouchers
├── returns.php      → GET /ravenapi/returns
└── creditslips.php  → GET /ravenapi/creditslips
```

#### Fonctionnalités API
- **Vouchers**: Récupération des cart rules avec états
- **Returns**: Liste des order_return avec produits et statuts
- **Credit slips**: Avoirs avec montants et liens PDF

### 🎨 Améliorations UX

#### Intégration Toast dans contextes
- **AuthContext**
  - Toast de bienvenue au login
  - Confirmation de déconnexion
  - Message de bienvenue inscription
  - Erreurs d'authentification

- **CartContext**
  - Confirmation ajout produit
  - Confirmation suppression
  - Succès/erreur code promo
  - Messages contextuels

#### Formulaires
- Suppression des alertes d'erreur redondantes
- Messages via toast uniquement
- Validation en temps réel conservée
- UX plus fluide et moderne

### 📝 Documentation
- **README.md** complet avec:
  - Liste de toutes les fonctionnalités
  - Comparaison PrestaShop vs Next.js
  - Guide d'installation et configuration
  - Structure du projet
  - Utilisation du système de toast

### 🐛 Corrections

- Fix: Erreur SSR avec useToast dans contextes
  - Solution: Try/catch pour rendre toast optionnel
  - Fonctionne en SSR et CSR
  
- Fix: Hydration mismatch Header (session précédente)
  - Solution: Dynamic import avec ssr: false
  
- Fix: Favicon montrant l'ancien Next.js default
  - Solution: Suppression de src/app/favicon.ico
  
- Fix: Address API 500 - checkZipCode method
  - Solution: Utilisation de la méthode statique

### 🔧 Technique

#### Build
- Compilation réussie sans erreurs TypeScript
- 36 pages générées (static + dynamic)
- Toutes les nouvelles pages incluses
- Optimisations Next.js appliquées

#### Performance
- Loading states pour meilleure perception
- Toast non-bloquants
- Erreurs gracieuses avec retry
- Navigation fluide

#### Structure
```
Nouvelles pages créées:
├── /compte/bons-reduction/
├── /compte/retours/
├── /compte/avoirs/
├── /mot-de-passe-oublie/[token]/
├── /error.tsx (global)
├── /loading.tsx (global)
└── error.tsx + loading.tsx dans sous-dossiers
```

### 📊 Statistiques

- **36 pages** au total
- **3 nouveaux endpoints** API
- **9 nouvelles pages/composants** créés
- **4 types de notifications** toast
- **5 pages d'erreur** spécifiques
- **4 pages de loading** ajoutées

### ♿ Accessibilité
- Toast avec icônes contextuelles
- Boutons de fermeture accessibles
- Messages d'erreur descriptifs
- Navigation au clavier préservée

### 🔐 Sécurité
- Validation token reset password
- Authentification requise pour nouvelles pages
- Gestion erreurs sans révéler infos sensibles
- Protection CSRF via PrestaShop

### 🎯 Parité PrestaShop Frontend

| Fonctionnalité | PrestaShop | Next.js | État |
|---|---|---|---|
| Bons de réduction | ✅ | ✅ | **Nouveau** |
| Retours produits | ✅ | ✅ | **Nouveau** |
| Avoirs | ✅ | ✅ | **Nouveau** |
| Reset password | ✅ | ✅ | **Nouveau** |
| Error handling | ✅ | ✅ | **Amélioré** |
| Notifications | Basique | ✅ Toast | **Amélioré** |
| Loading states | ✅ | ✅ | **Amélioré** |

**✅ Parité complète atteinte avec PrestaShop 1.7.8**

---

## Notes de migration

### Pour déployer ces changements:

1. **Backend (PrestaShop)**
   ```bash
   # Les fichiers API sont déjà en place
   /modules/ravenapi/controllers/front/vouchers.php
   /modules/ravenapi/controllers/front/returns.php
   /modules/ravenapi/controllers/front/creditslips.php
   ```

2. **Frontend (Next.js)**
   ```bash
   cd new-frontend
   npm run build
   pm2 restart next-frontend
   ```

3. **Vérifications post-déploiement**
   - [ ] Tester login/logout avec toasts
   - [ ] Vérifier page bons de réduction
   - [ ] Vérifier page retours
   - [ ] Vérifier page avoirs
   - [ ] Tester ajout au panier (toast)
   - [ ] Tester pages d'erreur (404, 500)
   - [ ] Vérifier loading states

### Breaking Changes
Aucun breaking change - toutes les modifications sont additives.

### Configuration requise
- Next.js 15+
- Node.js 18+
- PrestaShop 1.7.8+
- Module ravenapi actif

---

**Développé pour Raven Industries © 2025**
