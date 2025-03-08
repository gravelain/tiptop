#!/bin/sh
set -e

# Afficher un message de démarrage
echo "Démarrage du backend NestJS..."

# Exécuter les migrations (si applicable)
# npm run migration:run 

# Lancer l'application
exec "$@"
