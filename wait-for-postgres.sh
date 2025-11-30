#!/bin/sh
set -e

HOST="postgres"
PG_PORT="5432"

echo "Waiting for Postgres at $HOST:$PG_PORT..."

while ! nc -z "$HOST" "$PG_PORT"; do
  sleep 1
done

echo "Postgres is up!"
exec "$@"
