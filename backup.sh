#!/bin/bash

docker-compose -f production.yml exec pgbackups ./backup.sh

