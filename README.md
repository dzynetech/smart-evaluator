# Smart Site Evaluator
A Web based frontend that enables a user to evaluate the correctness of a source of site information.

## Getting started
The evaluator runs as a series of docker containers. There are three docker-compose files for running the system in 3 different modes:

### Development
  Use `docker-compose.yml`. Will build all containers from source for local development and allows for live changes of the UI. Exposes intermediate services like postgres and graphiql to the host network for debugging.

### Production
  Use `production.yml`. Build all containers from source in production mode. Only exposes UI and goaccess ports. Use `.env` to configure what port these services run on. All services will be reverse proxied through Nginx.

### AWS
 Use `aws.yml`. Identical to production, but uses prebuilt containers pulled from [Docker Hub](https://hub.docker.com/u/dzynetech). Use `.env` to configure what ports to use as well as what image tag to use. Image tags match the git branch they were built from. The only required files are `aws.yml` and `postgres/schema.sql` on first run to initalize the database, if you choose to run the database in docker-compose instead of externally (ie. with AWS Fargate).

### Secrets
All secret env variables should be put in `.env` file in the root directory. Additionally there are variables to configure docker compose based on what mode you've chosen above.
The file should look like:
```sh
# mode specific
TAG= # aws only 
UI_PORT= # aws or production
GOACCESS_PORT= # production only

# always used
DB_USER=
DB_PASSWORD=
DB_HOST=
JWT_SECRET=
GEOCODIO_API_KEY=
RDWATCH_HOST=
RDWATCH_USERNAME=
RDWATCH_PASSWORD=
```

### Create a new user:

Run in psql:
```
SELECT smart_private.register_user('my_username', 'my_password');
```
edit permission in the smart.user table

Find the source ID's you want to give the user access to and add them to the smart_Private.users_sources table:
```
INSERT INTO users_sources('user_id','source_id') VALUES(999,999);
```
### Import a source
Sources can be imported using the "import" button in the navigation bar. In python/manual_import, there are scripts for manually importing from a CSV file. [See manual import instructions here](python/manual_import/permits/README.md)

## Restoring Postgres DB
Follow [these instructions](postgres/restore.md).
