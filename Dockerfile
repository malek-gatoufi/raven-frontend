# =============================================================================
# Dockerfile de PRODUCTION pour Next.js
# =============================================================================

FROM node:20-alpine AS base

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat

WORKDIR /app

# =============================================================================
# Étape 1: Installation des dépendances
# =============================================================================
FROM base AS deps

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer TOUTES les dépendances (incluant devDependencies pour le build)
RUN npm ci

# =============================================================================
# Étape 2: Build de l'application
# =============================================================================
FROM base AS builder

WORKDIR /app

# Copier les node_modules de l'étape deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Désactiver la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED=1

# Variables NEXT_PUBLIC_* doivent être définies au moment du build
# car elles sont compilées dans le bundle JavaScript
ENV NEXT_PUBLIC_PRESTASHOP_URL=https://ravenindustries.fr
ENV NEXT_PUBLIC_API_URL=https://ravenindustries.fr
ENV NEXT_PUBLIC_SITE_URL=https://new.ravenindustries.fr
ENV NEXT_PUBLIC_SITE_NAME="Raven Industries"

# Build de l'application
RUN npm run build

# =============================================================================
# Étape 3: Image de production
# =============================================================================
FROM base AS runner

WORKDIR /app

# Variables d'environnement de production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers publics
COPY --from=builder /app/public ./public

# Définir les permissions correctes pour le cache prerender
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copier le build standalone (optimisé pour la production)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Utiliser l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Commande de démarrage
CMD ["node", "server.js"]
