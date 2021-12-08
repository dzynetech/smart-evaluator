#!/bin/bash
set -e

# SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# ROOT_DIR="$(dirname "$SCRIPT_DIR")"

ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SCRIPT_DIR=$ROOT_DIR

[[ $# -eq 1 ]] || (echo "pass the location of backup.sql.gz to restore" && exit 1)

gunzip -c $1 > "${SCRIPT_DIR}/restore.sql"
cd $SCRIPT_DIR
printf '%s\n%s\n' "create extension postgis;DROP SCHEMA PUBLIC cascade; CREATE SCHEMA PUBLIC; CREATE ROLE smart_anonymous; CREATE ROLE smart_user" "$(cat restore.sql)" > restore.sql
# delete the create schema public line
# sed -i '/^CREATE SCHEMA public/d' restore.sql
mv "${SCRIPT_DIR}/restore.sql" "${ROOT_DIR}/postgres/smart.sql"

cd $ROOT_DIR
docker-compose -f staging.yml down
docker-compose down
docker container prune -f
docker volume prune -f
docker-compose -f staging.yml up postgres
