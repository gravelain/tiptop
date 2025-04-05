#!/bin/bash

# Variables de date et chemins de sauvegarde
DATE=$(date +\%Y-\%m-\%d_\%H-\%M-\%S)

# 1. Restauration de la base de données PostgreSQL (SonarQube)
echo "Restauration de la base de données PostgreSQL en cours..."
PG_RESTORE_CMD="psql -h postgres_sonarqube -U sonar mydatabase_prod < /path/to/backups/sonar_backup_$DATE.sql"

# Vérification si le fichier de sauvegarde PostgreSQL existe
if [ -f "/path/to/backups/sonar_backup_$DATE.sql" ]; then
  $PG_RESTORE_CMD
  # Vérifier si la restauration PostgreSQL a réussi
  if [ $? -eq 0 ]; then
    echo "Restauration PostgreSQL réussie!"
  else
    echo "Erreur lors de la restauration PostgreSQL"
  fi
else
  echo "Le fichier de sauvegarde PostgreSQL n'existe pas."
fi

# 2. Restauration de la base de données SQLite (Backend Symfony)
echo "Restauration de la base de données SQLite en cours..."
if [ -f "/path/to/backups/mydatabase_dev_$DATE.sqlite" ]; then
  cp /path/to/backups/mydatabase_dev_$DATE.sqlite /var/www/html/var/data/mydatabase_dev.sqlite
  # Vérifier si la restauration SQLite a réussi
  if [ $? -eq 0 ]; then
    echo "Restauration SQLite réussie!"
  else
    echo "Erreur lors de la restauration SQLite"
  fi
else
  echo "Le fichier de sauvegarde SQLite n'existe pas."
fi
