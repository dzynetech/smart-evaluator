create function smart_private.change_user_password(uid integer,password text)
RETURNS void as $$
declare
BEGIN
	update smart_private.user_account set password_hash = public.crypt(password,public.gen_salt('bf'))
	where user_id = uid; 
end;
$$
language plpgsql
strict
security definer;