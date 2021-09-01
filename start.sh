#!/bin/bash

docker-compose -f production.yml build 
./stop.sh
docker-compose -f production.yml up -d 
