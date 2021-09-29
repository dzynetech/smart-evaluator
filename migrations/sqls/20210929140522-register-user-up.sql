create EXTENSION if not exists "pgcrypto";


create function smart.register_user(username text, password text)
RETURNS smart.user
as $$
declare
	new_user smart.user;
BEGIN
	insert into smart.user (username) values (username)
	returning * INTO new_user;
	insert into smart_private.user_account (user_id,password_hash)
	values (new_user.id, crypt(password,gen_salt('bf')));
return new_user;
end;
$$
language plpgsql
strict
security definer;