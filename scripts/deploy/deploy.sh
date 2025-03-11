#!/bin/bash

echo "🚀 Déploiement du projet TipTop en cours sur 95.111.240.167..."

# Aller à la racine du projet
cd "$(dirname "$0")/../.."

# Pull des dernières images depuis Docker Hub
echo "📥 Pull des nouvelles images Docker..."
docker pull thierrytemgoua98/mon-backend:latest
docker pull thierrytemgoua98/mon-frontend:latest

# Arrêt et suppression des anciens conteneurs backend et frontend
echo "🛑 Arrêt des anciens conteneurs frontend et backend..."
docker compose stop frontend backend
docker compose rm -f frontend backend

# Recréation des conteneurs avec les nouvelles images
echo "🔁 Redémarrage des services frontend et backend..."
docker compose up -d frontend backend

echo "✅ Déploiement terminé avec succès !"
echo "🌐 Accès à l'application : http://95.111.240.167:3003"