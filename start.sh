#!/bin/bash
set -ex

docker-compose -f production.yml build 
./stop.sh
docker-compose -f production.yml up -d 
