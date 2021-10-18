create function smart.authenticate (username text, password text)
returns smart.jwt
as $$
declare
	account smart_private.user_account;
	u_id int;
BEGIN
  SELECT id into u_id from smart.user 
  where smart.user.username = authenticate.username;
  SELECT * into account from smart_private.user_account
  where user_account.user_id = u_id; 
  
  if account.password_hash = crypt(password,account.password_hash) THEN
	RETURN ('smart_user',account.user_id,
	extract(epoch from (now() + interval '30 days'))
	)::smart.jwt;
  else
   return NULL;
  END if;
END;
$$
language plpgsql
strict
security definer;