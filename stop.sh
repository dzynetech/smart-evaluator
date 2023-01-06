#!/bin/bash
set -e
[ "$#" -ne 1 ] && (echo "Specify d,p, or a for dev, production, or aws environment" && exit 1)

[[ "$1" = "a" ]] && (docker-compose -f aws.yml down
[[ "$1" = "p" ]] && (docker-compose -f production.yml down
[[ "$1" = "d" ]] && (docker-compose down
