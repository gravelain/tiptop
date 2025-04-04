#!/bin/bash
set -e

echo "ℹ️  PostgreSQL Connection: host=$POSTGRES_HOST, port=$POSTGRES_PORT, user=$POSTGRES_USER, db=$POSTGRES_DB"

echo "Checking PostgreSQL availability on $POSTGRES_HOST:$POSTGRES_PORT with user $POSTGRES_USER..."

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  >&2 echo "PostgreSQL is unavailable - retrying in 2s..."
  sleep 2
done

echo "✅ PostgreSQL is up - continuing..."
exec "$@"
