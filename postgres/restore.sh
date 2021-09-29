#!/bin/bash
set -ex

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

[[ $# -eq 1 ]] || (echo "pass the location of backup.sql.gz to restore" && exit 1)

gunzip -c $1 > "${SCRIPT_DIR}/restore.sql"
cd $SCRIPT_DIR
printf '%s\n%s\n' "create extension postgis;" "$(cat restore.sql)" > restore.sql
mv "${SCRIPT_DIR}/restore.sql" "${ROOT_DIR}/postgres/smart.sql"

cd $ROOT_DIR
docker-compose -f production.yml down
docker-compose down
docker container prune -f
docker volume prune -f
docker-compose -f production.yml up

