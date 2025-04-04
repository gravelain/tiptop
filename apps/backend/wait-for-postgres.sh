#!/bin/bash
set -e

echo "ℹ️  PostgreSQL Connection: host=$POSTGRES_HOST, port=$POSTGRES_PORT, user=$POSTGRES_USER, db=$POSTGRES_DB"

echo "Checking PostgreSQL availability on $POSTGRES_HOST:$POSTGRES_PORT with user $POSTGRES_USER..."

max_attempts=30  # Nombre maximal de tentatives
attempt=1

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  if [ $attempt -ge $max_attempts ]; then
    >&2 echo "PostgreSQL is still unavailable after $max_attempts attempts - giving up."
    exit 1  # Échec si le nombre d'essais est atteint
  fi
  >&2 echo "PostgreSQL is unavailable - retrying in 5s... (Attempt $attempt/$max_attempts)"
  sleep 5
  ((attempt++))
done

echo "✅ PostgreSQL is up - continuing..."
exec "$@"
