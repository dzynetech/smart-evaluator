CREATE FUNCTION smart.can_view_permit(permit_id integer) RETURNS boolean AS $$
DECLARE
	this_source integer;
	result boolean;
begin
	select source_id into this_source from smart.permits where id=permit_id;
	return (select count(*)::int::bool from smart.users_sources where 
		source_id=this_source and 
		user_id=(current_setting('jwt.claims.user_id',true))::integer);
	return result;
end
$$ LANGUAGE plpgsql STABLE security definer;
