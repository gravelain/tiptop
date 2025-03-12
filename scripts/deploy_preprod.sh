#!/bin/bash
echo "🚀 Déploiement PREPROD..."
cd "$(dirname "$0")/../.."
docker compose -f docker-compose.preprod.yaml pull
docker compose -f docker-compose.preprod.yaml up -d --force-recreate
