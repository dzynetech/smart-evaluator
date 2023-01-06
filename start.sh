#!/bin/bash
set -e
[ "$#" -ne 1 ] && (echo "Specify d,p, or a for dev, production, or aws environment" && exit 1)

[[ "$1" = "a" ]] && docker-compose -f aws.yml up -d
[[ "$1" = "p" ]] && docker-compose -f production.yml up --build -d
[[ "$1" = "d" ]] && docker-compose up --build -d
