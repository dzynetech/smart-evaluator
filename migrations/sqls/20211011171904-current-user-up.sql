CREATE FUNCTION smart.current_user() RETURNS smart.user AS $$
declare
	curr_user_id integer;
	u smart.user;
begin
	curr_user_id = (nullif ((current_setting('jwt.claims.user_id',true)),'')::integer);
	select * into u from smart.user where id=curr_user_id;
	return u;
end;
$$ LANGUAGE plpgsql STABLE security definer;/* Replace with your SQL commands */

grant execute on function smart.current_user() to smart_user;
grant execute on function smart.current_user() to smart_anonymous;