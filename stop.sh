#!/bin/bash
set -e
[ "$#" -ne 1 ] && (echo "Specify d,s, or p for dev,staging or production environment" && exit 1)

[[ "$1" = "p" ]] && (docker-compose -f production.yml down && exit )
[[ "$1" = "s" ]] && (docker-compose -f staging.yml down && exit )
[[ "$1" = "d" ]] && (docker-compose down && exit )

