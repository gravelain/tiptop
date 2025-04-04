#!/bin/bash
# wait-for-mysql.sh

host="$1"
shift
cmd="$@"

until mysqladmin ping -h "$host" --silent; do
  >&2 echo "MySQL is unavailable - waiting"
  sleep 2
done

>&2 echo "MySQL is up - executing command"
exec $cmd
