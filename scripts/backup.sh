#!/bin/bash

# Variables de date
DATE=$(date +\%Y-\%m-\%d_\%H-\%M-\%S)

# 1. Sauvegarde de la base de données PostgreSQL (SonarQube)
echo "Sauvegarde de la base de données PostgreSQL en cours..."
PG_DUMP_CMD="pg_dump -h postgres_sonarqube -U sonar mydatabase_prod > /path/to/backups/sonar_backup_$DATE.sql"
$PG_DUMP_CMD

# Vérifier si la sauvegarde PostgreSQL a réussi
if [ $? -eq 0 ]; then
  echo "Sauvegarde PostgreSQL réussie!"
else
  echo "Erreur lors de la sauvegarde PostgreSQL"
fi

# 2. Sauvegarde de la base de données SQLite (Backend Symfony)
echo "Sauvegarde de la base de données SQLite en cours..."
cp /var/www/html/var/data/mydatabase_dev.sqlite /path/to/backups/mydatabase_dev_$DATE.sqlite

# Vérifier si la sauvegarde SQLite a réussi
if [ $? -eq 0 ]; then
  echo "Sauvegarde SQLite réussie!"
else
  echo "Erreur lors de la sauvegarde SQLite"
fi
