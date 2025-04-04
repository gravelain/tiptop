#!/bin/bash
# wait-for-postgres.sh

host="$1"
port="$2"
user="$3"
password="$4"
shift 4
cmd="$@"

echo "Args: host=$host port=$port user=$user password=********"
echo "Waiting for PostgreSQL at $host:$port..."

until PGPASSWORD=$password psql -h "$host" -U "$user" -d postgres -c '\q' 2>/dev/null; do
   >&2 echo "PostgreSQL is unavailable - retrying in 2s..."
   sleep 2
done

>&2 echo "PostgreSQL is up - executing command: $cmd"
exec $cmd
