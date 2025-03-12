#!/bin/bash
echo "🚀 Déploiement PROD..."
cd "$(dirname "$0")/../.."
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d --force-recreate
