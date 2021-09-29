alter default privileges revoke execute on functions from  public;

grant usage on schema smart to smart_anonymous, smart_user;
grant execute on function smart.register_user (text,text) to smart_anonymous;
grant execute on function smart.authenticate (text,text) to smart_anonymous, smart_user;
grant all PRIVILEGES on table smart.user to smart_user;
grant select,update on table smart.permits to smart_user;
grant select on table smart.sources to smart_user;