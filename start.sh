#!/bin/bash
set -e
[ "$#" -ne 1 ] && (echo "Specify d,s, or p for dev,staging or production environment" && exit 1)

[[ "$1" = "p" ]] && (docker-compose -f production.yml up --build -d && exit)
[[ "$1" = "s" ]] && (docker-compose -f staging.yml up --build -d && exit) 
[[ "$1" = "d" ]] && (docker-compose up --build -d && exit)
