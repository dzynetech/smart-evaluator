# Smart Site Evaluator


## Create a new user:

Run in psql:
```
SELECT smart_private.register_user("my_username", "my_password");
```
edit permission in the smart.user table

Find the source ID's you want to give the user access to and add them to the smart_Private.users_sources table:
```
INSERT INTO users_sources("user_id","source_id") VALUES(999,999);
```
