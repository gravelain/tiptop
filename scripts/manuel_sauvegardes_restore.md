L'automatisation avec Cron :

```markdown
# Backup et Restauration des Bases de Données

Ce guide décrit comment effectuer une sauvegarde et une restauration manuelles des bases de données PostgreSQL et SQLite utilisées dans ce projet. Il inclut également la configuration des tâches cron pour automatiser les sauvegardes.

## Sauvegarde Manuelle

### 1. Sauvegarde de la base de données PostgreSQL

Pour sauvegarder la base de données PostgreSQL de SonarQube, exécutez la commande suivante depuis le répertoire où se trouve le script `backup.sh` :

```bash
./backup.sh
```

Cette commande exécutera un `pg_dump` pour créer une sauvegarde de la base de données dans un fichier SQL dans le répertoire `/path/to/backups/`.

### 2. Sauvegarde de la base de données SQLite (Backend Symfony)

Pour sauvegarder la base de données SQLite du backend Symfony, exécutez la commande suivante depuis le répertoire où se trouve le script `backup_sqlite.sh` :

```bash
./backup_sqlite.sh
```

Cette commande copiera le fichier de base de données SQLite dans le répertoire de sauvegarde spécifié (`/path/to/backups/`).

## Restauration Manuelle

### 1. Restauration de la base de données PostgreSQL

Pour restaurer une sauvegarde PostgreSQL, utilisez la commande `psql`. Remplacez `sonar_backup_<date>.sql` par le fichier de sauvegarde de la base de données :

```bash
psql -h postgres_sonarqube -U sonar -d mydatabase_prod < /path/to/backups/sonar_backup_<date>.sql
```

### 2. Restauration de la base de données SQLite

Pour restaurer une base de données SQLite à partir d'une sauvegarde, utilisez la commande `cp` pour copier la sauvegarde dans le répertoire approprié :

```bash
cp /path/to/backups/mydatabase_dev_<date>.sqlite /var/www/html/var/data/mydatabase_dev.sqlite
```

## Tâches Cron

Les tâches cron permettent d'automatiser la sauvegarde des bases de données à intervalles réguliers. Voici les configurations à ajouter dans votre crontab.

### 1. Sauvegarde PostgreSQL automatique

Pour sauvegarder automatiquement la base de données PostgreSQL chaque jour à 2h du matin, ajoutez la ligne suivante dans votre crontab (`crontab -e`) :

```bash
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### 2. Sauvegarde SQLite automatique

Pour sauvegarder automatiquement la base de données SQLite chaque jour à 3h du matin, ajoutez la ligne suivante dans votre crontab (`crontab -e`) :

```bash
0 3 * * * /path/to/backup_sqlite.sh >> /var/log/sqlite_backup.log 2>&1
```

## Répertoire de Sauvegardes

Assurez-vous que le répertoire de sauvegarde (`/path/to/backups/`) existe et que le processus dispose des permissions nécessaires pour y écrire les fichiers de sauvegarde. 

### Exemple de commande pour créer un répertoire de sauvegarde :

```bash
mkdir -p /path/to/backups/
```

## Conclusion

Ce guide vous permet de gérer facilement la sauvegarde et la restauration de vos bases de données PostgreSQL et SQLite. En automatisant les sauvegardes via des tâches cron, vous minimisez le risque de perte de données.
```