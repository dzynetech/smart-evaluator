grant execute on function smart.register_user (text,text) to smart_anonymous;
revoke execute on function smart.register_user (text,text) from smart_user;
