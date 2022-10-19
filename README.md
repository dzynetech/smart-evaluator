# Smart Site Evaluator
A Web based frontend that enables a user to evaluate the correctness of a source of site information.

## Getting started
The evaluator runs as a series of docker containers. Use the start.sh and stop.sh script to orchestrate them accordingly.

### Secrets
All secret env variables should be put in a `secrets` file in the root directory. This includes:
```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DB_USER=
DB_PASSWORD=
DB_HOST=
HTTP_USERNAME=
HTTP_PASSWORD=
JWT_SECRET=
GEOCODIO_API_KEY=
```
### Create a new user:

Run in psql:
```
SELECT smart_private.register_user("my_username", "my_password");
```
edit permission in the smart.user table

Find the source ID's you want to give the user access to and add them to the smart_Private.users_sources table:
```
INSERT INTO users_sources("user_id","source_id") VALUES(999,999);
```
### Import a source
Sources can be imported using the "import" button in the navigation bar. In python/manual_import, there are scripts for manually importing from a CSV file. [See instructions here](python/manual_import/permits/README.md)

## Restoring Postgres DB
Follow [these instructions](postgres/restore.md).
