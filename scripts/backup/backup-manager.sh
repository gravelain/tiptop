#!/bin/bash

# Backup MySQL
docker exec mysql sh -c 'mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE' > backup/mysql/backup-$(date +%F).sql

# Backup PostgreSQL
docker exec postgres pg_dumpall -U $POSTGRES_USER > backup/postgres/backup-$(date +%F).sql

# Sync with AWS S3
aws s3 sync backup/ s3://tiptop-backups/$(date +%F)/
