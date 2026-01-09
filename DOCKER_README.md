# Docker & Nginx Setup - Raven Industries Next.js Frontend

## Prérequis

- Docker & Docker Compose
- Nginx
- Certbot (pour SSL)

## Démarrage rapide

### 1. Production

```bash
# Build et démarrer le container de production
./deploy.sh prod

# Ou manuellement
docker compose up -d --build
```

Le container de production tourne sur le port `3000`.

### 2. Développement

```bash
# Démarrer le container de développement avec hot reload
./deploy.sh dev

# Ou manuellement
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Le container de développement tourne sur le port `3001` avec hot reload activé.

## Configuration Nginx

### 1. Générer le certificat SSL

```bash
# Avec le script
./deploy.sh ssl

# Ou manuellement
sudo certbot certonly --nginx -d new.ravenindustries.fr
```

### 2. Configurer Nginx

```bash
# Avec le script
./deploy.sh nginx

# Ou manuellement
sudo cp nginx/new.ravenindustries.fr.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/new.ravenindustries.fr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Commandes utiles

```bash
# Voir les logs
./deploy.sh logs

# Arrêter les containers
./deploy.sh stop

# Rebuild complet
./deploy.sh rebuild

# Status des containers
./deploy.sh status
```

## Architecture

```
Internet
    │
    ▼
┌─────────────────────────────────────┐
│           Nginx (443/80)            │
│   new.ravenindustries.fr            │
│   - SSL Termination                 │
│   - Gzip Compression                │
│   - Static Cache                    │
└─────────────────────────────────────┘
    │
    ▼ (proxy_pass :3000)
┌─────────────────────────────────────┐
│    Docker Container (Next.js)       │
│    - Node.js 20 Alpine              │
│    - Port 3000                      │
│    - Standalone build               │
└─────────────────────────────────────┘
    │
    ▼ (API calls)
┌─────────────────────────────────────┐
│         PrestaShop Backend          │
│     ravenindustries.fr              │
└─────────────────────────────────────┘
```

## Variables d'environnement

### Production (.env)
```env
NEXT_PUBLIC_API_URL=https://ravenindustries.fr
NEXT_PUBLIC_SITE_URL=https://new.ravenindustries.fr
```

### Développement (.env.local)
```env
NEXT_PUBLIC_API_URL=https://ravenindustries.fr
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## Troubleshooting

### Le container ne démarre pas
```bash
# Vérifier les logs
docker compose logs

# Vérifier le build
docker compose build --no-cache
```

### Nginx ne trouve pas le certificat SSL
```bash
# Vérifier que le certificat existe
sudo ls -la /etc/letsencrypt/live/new.ravenindustries.fr/

# Régénérer si nécessaire
sudo certbot certonly --nginx -d new.ravenindustries.fr
```

### Hot reload ne fonctionne pas en dev
Le hot reload nécessite le montage du volume. Vérifiez que vous utilisez bien `docker-compose.dev.yml` :
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```
