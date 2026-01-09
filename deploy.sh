#!/bin/bash
# =============================================================================
# Script de déploiement - Raven Industries Next.js Frontend
# =============================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Répertoire du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Afficher l'aide
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  prod        Build et démarre le container de production"
    echo "  dev         Démarre le container de développement"
    echo "  stop        Arrête tous les containers"
    echo "  logs        Affiche les logs du container"
    echo "  rebuild     Rebuild et redémarre le container de production"
    echo "  ssl         Génère le certificat SSL Let's Encrypt"
    echo "  nginx       Configure et recharge Nginx"
    echo "  status      Affiche le status des containers"
    echo "  help        Affiche cette aide"
    echo ""
}

# Vérifier Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon n'est pas accessible"
        exit 1
    fi
}

# Build et démarrage Production
start_prod() {
    log_info "Construction de l'image de production..."
    docker-compose build
    
    log_info "Démarrage du container de production..."
    docker-compose up -d
    
    log_success "Container de production démarré sur le port 3000"
    log_info "Vérifiez les logs avec: $0 logs"
}

# Démarrage Développement
start_dev() {
    log_info "Démarrage du container de développement..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
}

# Arrêter les containers
stop_containers() {
    log_info "Arrêt des containers..."
    docker-compose down
    log_success "Containers arrêtés"
}

# Afficher les logs
show_logs() {
    docker-compose logs -f
}

# Rebuild et redémarrer
rebuild() {
    log_info "Arrêt des containers existants..."
    docker-compose down
    
    log_info "Reconstruction de l'image..."
    docker-compose build --no-cache
    
    log_info "Démarrage du container..."
    docker-compose up -d
    
    log_success "Container reconstruit et démarré"
}

# Générer le certificat SSL
generate_ssl() {
    log_info "Génération du certificat SSL pour new.ravenindustries.fr..."
    
    # Vérifier que certbot est installé
    if ! command -v certbot &> /dev/null; then
        log_error "Certbot n'est pas installé. Installez-le avec: apt install certbot python3-certbot-nginx"
        exit 1
    fi
    
    # Générer le certificat
    sudo certbot certonly --nginx -d new.ravenindustries.fr
    
    log_success "Certificat SSL généré"
    log_info "N'oubliez pas de configurer Nginx avec: $0 nginx"
}

# Configurer Nginx
configure_nginx() {
    NGINX_CONF="/etc/nginx/sites-available/new.ravenindustries.fr"
    NGINX_ENABLED="/etc/nginx/sites-enabled/new.ravenindustries.fr"
    
    log_info "Configuration de Nginx..."
    
    # Copier la configuration
    sudo cp "$SCRIPT_DIR/nginx/new.ravenindustries.fr.conf" "$NGINX_CONF"
    
    # Créer le lien symbolique si nécessaire
    if [ ! -L "$NGINX_ENABLED" ]; then
        sudo ln -s "$NGINX_CONF" "$NGINX_ENABLED"
    fi
    
    # Tester la configuration
    log_info "Test de la configuration Nginx..."
    if sudo nginx -t; then
        log_success "Configuration Nginx valide"
        
        # Recharger Nginx
        log_info "Rechargement de Nginx..."
        sudo systemctl reload nginx
        log_success "Nginx rechargé"
    else
        log_error "Configuration Nginx invalide"
        exit 1
    fi
}

# Afficher le status
show_status() {
    log_info "Status des containers:"
    docker-compose ps
    
    echo ""
    log_info "Utilisation des ressources:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" 2>/dev/null | grep raven || true
}

# Main
check_docker

case "${1:-help}" in
    prod)
        start_prod
        ;;
    dev)
        start_dev
        ;;
    stop)
        stop_containers
        ;;
    logs)
        show_logs
        ;;
    rebuild)
        rebuild
        ;;
    ssl)
        generate_ssl
        ;;
    nginx)
        configure_nginx
        ;;
    status)
        show_status
        ;;
    help|*)
        show_help
        ;;
esac
