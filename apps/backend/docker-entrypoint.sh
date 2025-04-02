#!/bin/sh
set -e

# Afficher un message de démarrage
echo "Démarrage du backend Symfony..."

# Lancer l'application
exec "$@"
