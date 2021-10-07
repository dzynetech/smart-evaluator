create function smart.change_password(password text) RETURNS void
as $$
BEGIN
	IF length(password) < 8 THEN
		RAISE EXCEPTION 'password is too short';
	END IF;
	PERFORM smart_private.change_user_password(current_setting('jwt.claims.user_id',true)::integer,password);
end;
$$
language plpgsql
strict
security definer;

grant execute on function smart.change_password(text) to smart_user;
