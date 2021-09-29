alter default privileges grant execute on functions to public;

revoke usage on schema smart from smart_anonymous, smart_user;
revoke execute on function smart.register_user (text,text) from smart_anonymous;
revoke execute on function smart.authenticate (text,text) from smart_anonymous, smart_user;
revoke all PRIVILEGES on table smart.user from smart_user;
revoke select,update on table smart.permits from smart_user;
revoke select on table smart.sources from smart_user;