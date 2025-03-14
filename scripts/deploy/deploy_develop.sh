#!/bin/bash
set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement du projet TipTop en cours sur 95.111.240.167..."

# Aller à la racine du projet
cd "$(dirname "$0")/../.."

# Pull des dernières images depuis Docker Hub
echo "📥 Pull des nouvelles images Docker..."
docker pull thierrytemgoua98/mon-backend:latest
docker pull thierrytemgoua98/mon-frontend:latest

# Vérification si les conteneurs sont déjà en cours et arrêt s'il y en a
if [ $(docker ps -q -f name=frontend) ]; then
    echo "🛑 Arrêt du conteneur frontend..."
    docker stop frontend
fi

if [ $(docker ps -q -f name=backend) ]; then
    echo "🛑 Arrêt du conteneur backend..."
    docker stop backend
fi

# Suppression des anciens conteneurs
echo "🗑️ Suppression des anciens conteneurs frontend et backend..."
docker-compose rm -f frontend backend

# Recréation des conteneurs avec les nouvelles images
echo "🔁 Redémarrage des services frontend et backend..."
docker-compose up -d frontend backend

# Vérification des logs
echo "🔍 Vérification des logs des services..."
docker-compose logs -f frontend backend

echo "✅ Déploiement terminé avec succès !"
echo "🌐 Accès à l'application : http://95.111.240.167:3003"
