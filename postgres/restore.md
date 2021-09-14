# How to copy production database locally 
1. login to remote server, and get into postgres container via:
```
docker-compose -f production.yml exec postgres /bin/bash
```
2. scp the backup from the server if restoring to local env:
```
pg_dump -U $POSTGRES_USER -d smart -f smart.sql

```
3. copy the dump using scp
```
 scp smart:smart.sql .
```
4. Modify the smart.sql file
  - add the lines `DROP SCHEMA PUBLIC cascade;CREATE SCHEMA PUBLIC;` to the top

4. stop the docker containers. remove all containers, and delete all volumes.
```
docker container prune
docker volume prune
```
5. docker-compose up postgres
6. delete the smart.sql file