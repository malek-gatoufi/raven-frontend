# Raven Industries - Frontend Next.js

Site e-commerce moderne développé avec Next.js 15, TypeScript et Tailwind CSS pour Raven Industries.

## 🚀 Fonctionnalités Principales

### Compte Utilisateur
- ✅ Connexion / Inscription avec validation avancée
- ✅ Dashboard compte avec tabs (Profil, Commandes, Adresses)
- ✅ Historique des commandes avec détails
- ✅ Gestion des adresses (CRUD)
- ✅ **Bons de réduction** - Liste et gestion des vouchers
- ✅ **Retours produits** - Suivi des demandes de retour
- ✅ **Avoirs** - Consultation des credit slips
- ✅ Réinitialisation du mot de passe par email

### Boutique
- ✅ Catalogue produits avec filtres et tri
- ✅ Fiches produits détaillées avec variations
- ✅ Panier avec gestion quantités et codes promo
- ✅ Tunnel de commande multi-étapes
- ✅ Recherche avancée avec suggestions
- ✅ Navigation par catégories
- ✅ Best sellers, Nouveautés, Promotions

### UX & Performance
- ✅ **Toast notifications** - Système de notifications contextuelles
- ✅ **Error boundaries** - Pages d'erreur spécifiques par section
- ✅ **Loading states** - Indicateurs de chargement cohérents
- ✅ Design responsive mobile-first
- ✅ Optimisation images Next.js
- ✅ SEO complet (metadata, OpenGraph, Schema.org)

## 🔌 API Backend

### Endpoints API (module ravenapi)

#### Nouveaux endpoints créés
```
GET /ravenapi/vouchers      → Liste des bons de réduction
GET /ravenapi/returns       → Liste des retours produits
GET /ravenapi/creditslips   → Liste des avoirs
```

#### Endpoints existants
```
Auth:     /auth, /customer
Cart:     /cart
Orders:   /orders, /order
Products: /products, /product, /search
...
```

## 🛠️ Stack Technique

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Radix UI** - Composants accessibles
- **PrestaShop 1.7.8.6** - Backend e-commerce

## 📦 Installation

```bash
# Installation
npm install

# Développement
npm run dev

# Production
npm run build
npm start
```

## 🔧 Configuration

Créer `.env.local` :
```env
NEXT_PUBLIC_API_URL=https://ravenindustries.fr
NEXT_PUBLIC_SITE_URL=https://new.ravenindustries.fr
NEXT_PUBLIC_COOKIE_DOMAIN=.ravenindustries.fr
```

## 🎨 Design System

- **Primary**: `#44D92C` (Vert Raven)
- **Background**: `#0a0a0a`
- **Font**: Exo 2

## 📝 Structure

```
src/
├── app/              # Pages (App Router)
│   ├── compte/       # Espace client
│   ├── checkout/     # Commande
│   ├── product/      # Produits
│   └── ...
├── components/       # Composants
│   ├── ui/           # UI (toast, button, card...)
│   └── layout/       # Header, Footer
├── contexts/         # Auth & Cart contexts
├── lib/              # API client & utils
└── types/            # Types TypeScript
```

## 🐛 Debug & Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📊 Parité PrestaShop

| Fonctionnalité | PrestaShop | Next.js | Status |
|----------------|------------|---------|--------|
| Login/Register | ✅ | ✅ | ✅ |
| Mon compte | ✅ | ✅ | ✅ |
| Commandes | ✅ | ✅ | ✅ |
| Adresses | ✅ | ✅ | ✅ |
| **Bons de réduction** | ✅ | ✅ | ✅ **Nouveau** |
| **Retours** | ✅ | ✅ | ✅ **Nouveau** |
| **Avoirs** | ✅ | ✅ | ✅ **Nouveau** |
| **Reset password** | ✅ | ✅ | ✅ **Nouveau** |
| Panier | ✅ | ✅ | ✅ |
| Checkout | ✅ | ✅ | ✅ |
| 404/500 pages | ✅ | ✅ | ✅ **Amélioré** |

## 🔔 Système de Notifications

Le système de toast est intégré dans :
- **AuthContext** - Login, logout, register
- **CartContext** - Add item, remove item, apply promo
- **Formulaires** - Validation et erreurs

Utilisation :
```tsx
import { useToast } from '@/components/ui/toast';

const toast = useToast();
toast.success('Produit ajouté !');
toast.error('Erreur');
toast.warning('Attention');
toast.info('Information');
```

## 📞 Support

contact@ravenindustries.fr

---

**Raven Industries © 2025**
