#!/bin/bash
# wait-for-mysql.sh

host="$1"
port="$2"
user="$3"
password="$4"
shift 4
cmd="$@"

# Debug : Afficher les arguments passés au script
echo "Args: host=$host port=$port user=$user password=$password"
echo "Waiting for MySQL at $host:$port..."

until mysqladmin ping -h "$host" -P "$port" -u "$user" -p"$password" --silent; do
  >&2 echo "MySQL is unavailable - retrying in 2s..."
  sleep 2
done

>&2 echo "MySQL is up - executing command: $cmd"
exec $cmd
