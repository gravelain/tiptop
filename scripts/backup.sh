#!/bin/bash

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="./backups/\$TIMESTAMP"
mkdir -p "\$BACKUP_DIR"

echo "[*] Backup Jenkins volume..."
docker run --rm -v jenkins_data:/data -v "\$PWD/\$BACKUP_DIR":/backup alpine tar czf /backup/jenkins_data.tar.gz -C /data .

echo "[*] Backup Postgres volume..."
docker run --rm -v postgres_data:/data -v "\$PWD/\$BACKUP_DIR":/backup alpine tar czf /backup/postgres_data.tar.gz -C /data .

echo "[✔] Sauvegarde terminée : \$BACKUP_DIR"
