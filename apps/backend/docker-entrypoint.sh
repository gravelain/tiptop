#!/bin/sh
set -e

# Attendre que PostgreSQL soit prêt sur le port 5433
/usr/local/bin/wait-for-postgres.sh postgres 5433 bdd_user bdd_pass

# Lancer le serveur PHP-FPM
exec php-fpm
