#!/bin/sh
set -e

# Attendre que PostgreSQL soit prêt
/usr/local/bin/wait-for-postgres.sh postgres 5432 bdd_user bdd_pass

# Lancer le serveur PHP-FPM
exec php-fpm
