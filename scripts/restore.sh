#!/bin/bash

if [ -z "\$1" ]; then
  echo "Usage: ./restore.sh <backup-folder>"
  exit 1
fi

BACKUP_DIR="./backups/\$1"

echo "[*] Restoring Jenkins..."
docker run --rm -v jenkins_data:/data -v "\$PWD/\$BACKUP_DIR":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/jenkins_data.tar.gz -C /data"

echo "[*] Restoring Postgres..."
docker run --rm -v postgres_data:/data -v "\$PWD/\$BACKUP_DIR":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/postgres_data.tar.gz -C /data"

echo "[✔] Restauration terminée"
