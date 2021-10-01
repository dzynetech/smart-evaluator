/* Replace with your SQL commands */

CREATE FUNCTION smart.get_user_id() RETURNS integer AS $$
begin
	return (nullif ((current_setting('jwt.claims.user_id',true)),'')::integer);
end
$$ LANGUAGE plpgsql STABLE security definer;

grant execute on function smart.get_user_id() to smart_user;
grant execute on function smart.get_user_id() to smart_anonymous;