
revoke execute on function smart.register_user (text,text) from smart_anonymous;
grant execute on function smart.register_user (text,text) to smart_user;